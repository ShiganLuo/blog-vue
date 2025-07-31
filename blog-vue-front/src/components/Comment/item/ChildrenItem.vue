<script setup lang="ts">
import { reactive, ref, watch, h } from 'vue';
import { frontGetChildrenComment, applyComment, deleteComment } from '@/api/comment';
import { ElNotification, ElMessageBox } from 'element-plus';

import Pagination from '@/components/Pagination/pagination.vue';
import CommentInput from './CommentInput.vue';
import { useUserStore } from '@/stores/index';
import Loading from '@/components/Loading/index.vue';
import { addLike, cancelLike } from '@/api/like';
import { getCurrentType } from '@/utils/tool';

import type { CommentItem, CommentTo, CommentParams } from './comment';

const userStore = useUserStore();

const emits = defineEmits<{
  (e: 'parentApply', val: CommentTo): void;
  (e: 'refresh'): void;
  (e: 'changeShowApplyInput', val: boolean): void;
}>();

const props = defineProps<{
  type: string;
  parent_id: number;
  id: number;
  parentShowApply: boolean;
  authorId: number;
}>();

const params = reactive<CommentParams>({
  current: 1,
  size: 5,
  type: '',
  for_id: 0,
  parent_id: 0,
  order: '',
  loading: false,
  user_id: userStore.getUserInfo.id,
});

const commentList = ref<CommentItem[]>([]);
const commentTotal = ref<number>(0);
const currentCommentIndex = ref<number>(0);

const showApplyInput = ref<boolean>(false);
const commentTo = reactive<CommentTo>({
  to_name: '',
  to_avatar: '',
  to_id: '',
  parent_id: 0,
  from_id: 0,
  from_name: '',
  from_avatar: '',
  content: '',
});
const primaryCommentTo = reactive<CommentTo>({ ...commentTo });
const commentText = ref<string>('');
const commentInputRef = ref<InstanceType<typeof CommentInput> | null>(null);

const isParentApply = ref<boolean>(false);
const likePending = ref<boolean>(false);

const closeComment = () => {
  emits('changeShowApplyInput', false);
  isParentApply.value = false;
  showApplyInput.value = false;
  Object.assign(commentTo, primaryCommentTo);
};

const getComment = async (type?: string) => {
  params.loading = true;
  if (type === 'clear') {
    params.current = 1;
  }
  params.type = String(getCurrentType(props.type));
  const res = await frontGetChildrenComment(params);
  if (res?.code === 200) {
    const { list, total } = res.result;
    commentList.value = list;
    commentTotal.value = Number(total);
  } else {
    ElNotification({
      offset: 60,
      title: '错误提示',
      message: h('div', { style: 'color: #f56c6c; font-weight: 600;' }, res.message),
    });
  }
  params.loading = false;
};

const like = async (item: CommentItem, index: number) => {
  if (likePending.value) return;
  likePending.value = true;
  let res;
  if (item.is_like) {
    res = await cancelLike({ for_id: item.id, type: 4, user_id: userStore.getUserInfo.id });
    if (res?.code === 0) {
      item.is_like = false;
      item.thumbs_up--;
    }
  } else {
    res = await addLike({ for_id: item.id, type: 4, user_id: userStore.getUserInfo.id });
    if (res?.code === 200) {
      item.is_like = true;
      item.thumbs_up++;
    }
  }
  likePending.value = false;
};

const apply = (item: CommentItem, type: 'parent' | 'children', index = 0) => {
  if (type === 'parent') {
    isParentApply.value = true;
    emits('changeShowApplyInput', true);
  } else {
    isParentApply.value = false;
    currentCommentIndex.value = index;
    emits('changeShowApplyInput', false);
  }
  Object.assign(commentTo, {
    parent_id: props.parent_id,
    from_id: item.from_id,
    from_avatar: item.from_avatar,
    from_name: item.from_name,
    content: '',
  });
  commentText.value = '';
  showApplyInput.value = true;
};

const deleteOwnComment = (id: number) => {
  ElMessageBox.confirm('确认删除此条评论吗', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(async () => {
    const res = await deleteComment(id);
    if (res?.code === 200) {
      ElNotification({
        offset: 60,
        title: '提示',
        message: h('div', { style: 'color: #7ec050; font-weight: 600;' }, '删除成功'),
      });
      getComment();
      emits('refresh');
    } else {
      ElNotification({
        offset: 60,
        title: '错误提示',
        message: h('div', { style: 'color: #f56c6c; font-weight: 600;' }, res.message),
      });
    }
  });
};

const pagination = (page: { current: number }) => {
  params.current = page.current;
  getComment();
};

const publish = async () => {
  if (!userStore.getUserInfo.id) {
    ElNotification({
      offset: 60,
      title: '温馨提示',
      message: h('div', { style: 'color: #e6c081; font-weight: 600;' }, '请先登录'),
    });
    return;
  }

  if (isParentApply.value) {
    commentTo.content = commentText.value;
    emits('parentApply', commentTo);
    closeComment();
    return;
  }

  const data = {
    from_id: userStore.getUserInfo.id,
    from_avatar: userStore.getUserInfo.avatar,
    from_name: userStore.getUserInfo.nick_name,
    to_id: commentTo.from_id,
    to_avatar: commentTo.from_avatar,
    to_name: commentTo.from_name,
    content: commentText.value,
    parent_id: commentTo.parent_id,
    for_id: props.id,
    type: getCurrentType(props.type),
    author_id: props.authorId,
  };

  const res = await applyComment(data);
  if (res?.code === 0) {
    commentText.value = '';
    ElNotification({
      offset: 60,
      title: '提示',
      message: h('div', { style: 'color: #7ec050; font-weight: 600;' }, '评论成功'),
    });
    closeComment();
    params.current = 1;
    getComment();
    commentInputRef.value?.clear();
  } else {
    ElNotification({
      offset: 60,
      title: '错误提示',
      message: h('div', { style: 'color: #f56c6c; font-weight: 600;' }, res.message),
    });
  }
};

watch(
  () => props.parent_id,
  () => {
    Object.assign(params, {
      for_id: props.id,
      type: props.type,
      parent_id: props.parent_id,
    });
    getComment();
  },
  { immediate: true }
);

defineExpose({ getComment, closeComment, apply });
</script>

<template>
  <div class="comment-children">
    <div v-if="commentList.length > 0" class="animate__animated animate__fadeIn">
      <div
        class="!mt-[0.5rem] flex justify-start items-start"
        v-for="(comment, index) in commentList"
        :key="comment.id"
      >
        <div class="!w-[30px] flex justify-start">
          <el-avatar :src="comment.from_avatar" :size="24" shape="circle"></el-avatar>
        </div>
        <div class="!ml-[5px]">
          <div>
            <span class="!mr-[0.5rem]">{{ comment.from_name }}</span>
            <span v-if="comment.from_id == 1" class="up">UP</span>
            <span class="!mr-[1rem] content-apply">回复</span>
            <span class="to-name">@</span>
            <span class="!mr-[3px] to-name"> {{ comment.to_name }}: </span>
            <span class="content" v-html="comment.content"></span>
          </div>
          <div class="!mt-[0.5rem]">
            <span class="!mr-[1rem] ip">{{ `IP: ${comment.ipAddress}` }}</span>
            <span
              :class="[
                'thumbs',
                '!mr-[1rem]',
                'iconfont',
                'icon-icon1',
                comment.is_like ? 'like-active' : '',
              ]"
              @click="like(comment, index)"
            >
              <span class="!ml-[0.5rem]">{{ comment.thumbs_up }}</span>
            </span>
            <span
              class="!mr-[1rem] apply cursor-pointer"
              v-if="userStore.getUserInfo.id != comment.from_id"
              @click="apply(comment, 'children', index)"
              >回复</span
            >
            <!-- 这个关闭按钮只关闭子评论的输入框 回复主评论的输入框在ParentItem里关闭 -->
            <span
              class="!mr-[1rem] close cursor-pointer"
              v-if="showApplyInput && !isParentApply && index == currentCommentIndex"
              @click="closeComment"
              >关闭</span
            >
            <span
              class="!mr-[1rem] delete cursor-pointer"
              v-if="userStore.getUserInfo.id == comment.from_id || userStore.getUserInfo.role == 1"
              @click="deleteOwnComment(comment.id)"
              >删除</span
            >
          </div>
          <div class="!mt-[0.5rem]">{{ comment.createdAt }}</div>
        </div>
      </div>
    </div>
    <Loading :size="24" v-if="params.loading" />
    <template v-if="showApplyInput">
      <div class="w-[100%] flex justify-start items-center">
        <CommentInput
          ref="commentInputRef"
          v-model:inputText="commentText"
          :placeholder="commentTo.from_name || ''"
          :show-publish-button="false"
          :parent="false"
          @publish="publish"
        />
      </div>
    </template>
    <Pagination
      class="animate__animated animate__fadeIn"
      v-if="commentTotal > params.size"
      :size="params.size"
      :current="params.current"
      layout="prev, pager, next"
      :total="commentTotal"
      @pagination="pagination"
    />
  </div>
</template>

<style lang="scss" scoped>
.comment-children {
  margin-top: 1rem;
}

.content {
  font-size: 14px;
  word-break: break-all;
  vertical-align: middle;
}
.thumbs {
  word-break: keep-all;
  font-size: 1rem;
}
.apply {
  word-break: keep-all;
  font-size: 1rem;
  color: var(--md-active);
}
.apply:hover {
  color: var(--primary);
}

.content-apply {
  font-size: 0.8rem;
}
.to-name {
  color: var(--primary);
}
.ip {
  font-size: 0.8rem;
  color: var(--font-color);
  display: inline-block;
}
.show-more {
  cursor: pointer;
  margin-top: 3px;

  &:hover {
    color: var(--primary);
  }
}
.like-active {
  color: var(--primary);
  transform: scale(1.05);
}

.up {
  margin-right: 1rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--hot-color);
}

.close {
  color: var(--top);
  word-break: keep-all;
  font-size: 1rem;
  &:hover {
    color: var(--hot-color);
  }
}
.delete {
  word-break: keep-all;
  font-size: 1rem;
  color: var(--top);
  &:hover {
    color: var(--hot-color);
  }
}
.pagination {
  text-align: left;
  margin: 0.5rem 0;
  display: flex;
  flex-direction: row;
  :deep(.el-pagination) {
    font-size: 0.8rem;
    --el-pagination-button-width: 16px;
    --el-pagination-button-height: 16px;
    --el-pagination-button-disabled-color: var(--el-text-color-placeholder);
    --el-pagination-button-disabled-bg-color: var(--el-fill-color-blank);
    --el-pagination-button-bg-color: var(--el-fill-color);
    --el-pagination-hover-color: var(--el-color-primary);
    --el-pagination-font-size-small: 12px;
    --el-pagination-button-width-small: 16px;
    --el-pagination-button-height-small: 16px;
    --el-pagination-item-gap: 8px;
  }
}
</style>

