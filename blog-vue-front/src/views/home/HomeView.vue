<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, type Ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/index";

import { homeGetArticleList } from "@/api/article";
import { homeGetConfig } from "@/api/config";
import { getAllTag } from "@/api/tag";
import { homeGetStatistic } from "@/api/home";
import { randomFontColor, numberFormate } from "@/utils/tool";
import PageHeader from "@/components/PageHeader/index.vue";
import HomeArticleList from "@/components/HomeArticle/home-article-list.vue";
import RightSide from "@/components/RightSide/right-side.vue";
import { gsapTransY } from "@/utils/transform";

// 类型定义
interface Article {
  id: number;
  title: string;
  // 根据实际接口补充其他字段
}

interface ConfigDetail {
  blog_avatar?: string;
  createdAt?: string;
  articleCount?: number;
  view_time?: number;
  qq_group?: string;
  we_chat_group?: string;
  blog_notice?: string;
  // 其他配置字段...
}

interface Tag {
  id: number;
  tag_name: string;
  color: string;
}

interface PaginationParams {
  current: number;
  size: number;
  loading: boolean;
}

// 初始化逻辑
const userStore = useUserStore();
const router = useRouter();

/** 文章相关逻辑 */
const param: PaginationParams = reactive({
  current: 1, // 当前页
  size: 5, //每页条目数
  loading: true, //加载
});

const articleList: Ref<Article[]> = ref([]);
const articleTotal: Ref<number> = ref(0);

const getHomeArticleList = async (): Promise<void> => {
  try {
    const res = await homeGetArticleList( { pageNum: param.current, pageSize: param.size });
    if (res.code === 200) {
      const { list, total } = res.result;
      articleList.value = list;
      articleTotal.value = total;
    }
  } finally {
    param.loading = false;
  }
};

const pagination = (page: { current: number }): void => {
  param.current = page.current;
  getHomeArticleList();
};

/** 右侧边栏相关逻辑 */
const rightSizeLoading: Ref<boolean> = ref(false);
const runtime: Ref<number> = ref(0);
const configDetail: Ref<ConfigDetail> = ref({});
const tags: Ref<Tag[]> = ref([]);

// 获取网站详细信息
const getConfigDetail = async (): Promise<void> => {
  try {
    const res = await homeGetConfig();
    if (res.code === 200 && typeof res.result !== "string") {
      configDetail.value = res.result as ConfigDetail;
      userStore.setBlogAvatar(res.result.blog_avatar || '');
      calcRuntimeDays(configDetail.value.createdAt || '');
    }
  } finally {
    rightSizeLoading.value = false;
  }
};

// 获取文章数、分类数、标签数
const getStatistic = async (): Promise<void> => {
  const res = await homeGetStatistic();
  if (res.code === 0) {
    Object.assign(configDetail.value, res.result);
  }
};

// 获取所有标签
const getAllTags = async (): Promise<void> => {
  const res = await getAllTag();
  if (res.code === 0) {
    tags.value = (res.result as Tag[]).map(r => ({
      ...r,
      color: randomFontColor()
    }));
  }
};

// 计算网站运行天数
const calcRuntimeDays = (time: string): void => {
  if (time) {
    const formattedTime = time.replace(/-/g, '/');
    const now = new Date().getTime();
    const created = new Date(formattedTime).getTime();
    const days = Math.floor((now - created) / 8.64e7);
    runtime.value = days;
  }
};

const init = async (): Promise<void> => {
  param.loading = true;
  rightSizeLoading.value = true;
  await Promise.all([
    getHomeArticleList(),
    getConfigDetail(),
    getStatistic(),
    getAllTags()
  ]);
};

const observeMobileBox = (): void => {
  nextTick(() => {
    gsapTransY([".mobile-top-card", ".mobile-bottom-card"], -30, 0.3, "bounce.in");
    gsapTransY([".mobile-bottom-card"], 30, 0.3, "none");
  });
};

onMounted(async () => {
  await init();
  observeMobileBox();
});
</script>

<template>
  <PageHeader/>
  <div class="home_center_box">
    <el-row>
      <el-col :xs="24" :sm="18">
        <HomeArticleList
          :article-list="articleList"
          :param="param"
          :article-total="articleTotal"
          @page-change="pagination"
        />


      </el-col>

      <el-col :xs="0" :sm="6">
        <RightSide
          :config-detail="configDetail"
          :tags="tags"
          :runtime="runtime"
          :loading="rightSizeLoading"
        />

      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.mobile-top-card {
  height: 31rem;
  margin: 4px;

  :deep(.info-avatar) {
    padding: 0 2rem;
  }

  :deep(.personal-say) {
    padding-left: 1rem;
  }

  :deep(.info-background) {
    height: 12rem;
    width: 100%;
  }

  :deep(.common-menu) {
    padding: 1rem 5.5rem;
  }

  :deep(.git-ee) {
    padding: 0 4rem;
  }

  :deep(.personal-link) {
    padding: 1rem 6rem;
  }
}

.mobile-bottom-card {
  margin: 4px;
  padding: 1rem;

  .icon-localoffer {
    font-weight: 900;
  }

  span {
    margin-left: 0.3rem;
  }

  .site-info {
    padding: 0.3rem 1rem;
    line-height: 2;
    font-size: 1rem;

    .value {
      font-weight: 600;
    }
  }
}

.group {
  margin-left: 0.3rem;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .img {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-right: 10px;
  }
}
</style>
