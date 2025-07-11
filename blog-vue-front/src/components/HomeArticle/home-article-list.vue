<script lang="ts" setup>
import { nextTick, watch, type PropType } from "vue";
import { useRouter, type RouteLocationRaw } from "vue-router";

import { numberFormate } from "@/utils/tool";

import ArticleSkeleton from "./components/article-skeleton.vue";
import Tooltip from "@/components/ToolTip/index.vue";
import Pagination from "../Pagination/pagination.vue";
import GsapCount from "@/components/GsapCount/index.vue";

import { gsapTransY } from "@/utils/transform";
import { isMobile } from "@/utils/tool";
import SvgIcon from "@/components/SvgIcon/index.vue";

// 新增类型定义
interface Article {
  id?: string | number;
  article_cover?: string;
  article_title?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryNameList?: string[];
  tagNameList?: string[];
  thumbs_up_times?: number;
  view_times?: number;
  article_description?: string;
  is_top?: number;
}

interface ParamType {
  loading: boolean;
  size: number;
  current: number;
}

interface PageState {
  size: number;
  current: number;
}

const emit = defineEmits<{
  (event: "pageChange", payload: PageState): void;
}>();

const props = defineProps({
  articleList: {
    type: Array as PropType<Article[]>,
    default: () => [] as Article[],
  },
  articleTotal: {
    type: Number,
    default: 0,
  },
  param: {
    type: Object as PropType<ParamType>,
    default: () => ({
      loading: false,
      size: 10,
      current: 1,
    }),
  },
});

const router = useRouter();

/* 文章操作 start */
type OperateType = "detail" | "tag" | "category";
const operate = (type: OperateType, item: Article): void => {
  const routes: Record<OperateType, RouteLocationRaw> = {
    detail: { path: "/article", query: { id: item.id } },
    tag: { path: "/tag" },
    category: { path: "/category" },
  };
  router.push(routes[type]);
};
/* 文章操作 end */

let layout: string = " prev, pager, next"; // 分页组件会展示的功能项

const pagination = (page: PageState): void => {
  emit("pageChange", {
    current: page.current,
    size: page.size
  });
};

watch(
  () => props.articleList,
  (): void => {
    if (!props.articleList.length) return;
    nextTick(() => {
      let listArticle: string[] = [];
      for (let i = 0; i < props.articleList.length; i++) {
        if (!isMobile()) {
          if (i >= 1) {
            listArticle.push(".article" + i);
          }
        } else {
          listArticle.push(".article" + i);
        }
      }
      gsapTransY(listArticle, 30, 0.3, "none");
    });
  }
);
</script>

<template>
  <el-row class="root">
    <template v-if="param.loading">
      <el-col v-for="item in 5" :key="item">
        <el-card class="card-hover">
          <div class="article-box">
            <el-skeleton :loading="param.loading" style="height: 100%" animated>
              <template #template>
                <ArticleSkeleton />
              </template>
            </el-skeleton>
          </div>
        </el-card>
      </el-col>
    </template>
    <template v-else>
      <template v-if="articleList.length">
        <el-col
          :class="['article-col', 'article' + index]"
          v-for="(item, index) in articleList"
          :key="item.id"
        >
          <el-card class="card-hover">
            <div
              class="article-box"
              :style="{
                'flex-direction': index % 2 == 0 ? 'row' : 'row-reverse',
              }"
            >
              <div
                :class="['article-cover', 'article-cover' + index]"
                @click="operate('detail', item)"
              >
                <div
                  v-image="item.article_cover"
                  class="scale flex justify-center items-center"
                  style="width: 100%; height: 100%"
                >
                  <el-image :src="item.article_cover" fit="cover" class="image">
                    <template #error>
                      <svg-icon name="image404" :width="15" :height="15"></svg-icon>
                    </template>
                  </el-image>
                </div>
              </div>
              <!-- 信息 -->
              <div class="article-info flex_c_between">
                <span
                  class="title text_overflow"
                  :title="item.article_title"
                  @click="operate('detail', item)"
                >
                  {{ item.article_title }}
                </span>
                <div class="meta">
                  <span v-if="item.is_top == 1" class="to_pointer">
                    <i class="iconfont icon-zhiding"></i>
                    <span class="meta-label">置顶</span>
                  </span>
                  <span v-if="item.is_top == 1" class="article-meta__separator"></span>
                  <span class="to_pointer">
                    <i class="iconfont icon-calendar2"></i>
                    <span class="meta-label">发表于</span>
                    <span class="meta-value">{{ item.createdAt }}</span>
                  </span>
                  <span class="to_pointer">
                    <i class="iconfont icon-schedule"></i>
                    <span class="meta-label">更新于</span>
                    <span class="meta-value">{{ item.updatedAt }}</span>
                  </span>
                  <span class="article-meta__separator"></span>
                  <span class="to_pointer" @click="operate('category', item)">
                    <i class="iconfont icon-folder"></i>
                    <span
                    class="meta-value"
                    v-for="(categoryName, index) in (item.categoryNameList ?? []).slice(0, 3)"
                    :key="index"
                    >{{ index == (item.categoryNameList ?? []).length - 1 ? categoryName : categoryName + "、" }}</span>
                  </span>
                  <span class="article-meta__separator"></span>
                  <span class="to_pointer" @click="operate('tag', item)">
                    <i class="iconfont icon-label_fill"></i>
                    <span
                      class="meta-value"
                      v-for="(tagName, index) in (item.tagNameList ?? []).slice(0, 3)"
                      :key="index"
                    >
                      {{ index == (item.tagNameList ?? []).length - 1 ? tagName : tagName + "、" }}
                    </span>
                  </span>
                  <span class="article-meta__separator"></span>
                  <span class="to_pointer">
                    <i class="iconfont icon-icon1"></i>
                    <GsapCount
                      class="meta-value"
                      v-if="(item.thumbs_up_times ?? 0) - 0 < 1000"
                      :value=parseFloat(numberFormate(item.thumbs_up_times))
                    />
                    <span v-else class="meta-value">
                      {{ numberFormate(item.thumbs_up_times) }}
                    </span>
                  </span>
                  <span class="article-meta__separator"></span>
                  <span class="to_pointer">
                    <i class="iconfont icon-chakan"></i>
                    <GsapCount
                      class="meta-value"
                      v-if="(item.view_times ?? 0) - 0 < 1000"
                      :value=parseFloat(numberFormate(item.view_times))
                    />
                    <span v-else class="meta-value">
                      {{ numberFormate(item.view_times) }}
                    </span>
                  </span>
                </div>
                <Tooltip
                  width="100%"
                  size="1.2rem"
                  align="left"
                  :lineHeight="3"
                  :name="item.article_description"
                />
              </div>
            </div>
          </el-card>
        </el-col>
      </template>
      <template v-else>
        <div class="no-article">暂无文章，请先到后台发布文章～</div>
      </template>
    </template>
    <Pagination
      class="!mt-[2rem]"
      :size="param.size"
      :current="param.current"
      :layout="layout"
      :total="articleTotal"
      @pagination="pagination"
    />
  </el-row>
</template>

<style lang="scss" scoped>
.article-cover {
  .image {
    width: 100%;
    height: 100%;
    vertical-align: bottom;
    display: grid;
    place-items: center;
  }
}

.no-article {
  color: var(--font-color);
  width: 100%;
  height: 80vh;
  line-height: 80vh;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.article-info {
  flex: 1;
  .title {
    display: inline-block;
    width: 100%;
    font-size: 1.6rem;
    color: var(--font-color);
    font-weight: 600;
    line-height: 2.4;
    transition: 0.2s ease-in-out;

    &:hover {
      cursor: pointer;
      color: var(--primary);
    }
  }

  .meta {
    color: var(--meta-color);
    line-height: 1.4;
    font-size: 100%;
    font-weight: 500;

    .icon-zhiding {
      font-size: 1rem;
      color: var(--top);
    }

    &-label {
      padding-right: 0.2rem;
    }

    &-value {
      padding-right: 0.2rem;
    }

    .icon-label_fill {
      font-size: 1.2rem;
    }

    .icon-icon1 {
      font-size: 1.2rem;
    }

    .icon-chakan {
      font-size: 1.2rem;
    }

    .article-meta__separator {
      margin: 0 0.4rem;
      font-size: 1.1rem;
      position: relative;

      &::after {
        content: "|";
        position: absolute;
        top: -3px;
        right: 0;
      }
    }

    i {
      margin: 0 0.2rem 0 0;
    }
  }
}

@media screen and (max-width: 768px) {
  .article-box {
    display: flex;
    justify-content: space-around;
    flex-direction: column !important;
    align-items: center;
    height: 28rem;
  }

  .article-cover {
    width: 100%;
    height: 14rem;
    overflow: hidden;
  }

  .article-info {
    flex: 1;
    width: 100%;
    padding: 1rem 1.5rem;
    overflow: hidden;
    display: inline-block;
  }
}

// pc
@media screen and (min-width: 768px) {
  .article-box {
    display: flex;
    align-items: center;
    height: 16rem;
  }

  .article-cover {
    width: 40%;
    height: 100%;
    overflow: hidden;
  }

  .article-info {
    width: 55%;
    padding: 0 20px;
    overflow: hidden;
    display: inline-block;
  }
}
</style>
