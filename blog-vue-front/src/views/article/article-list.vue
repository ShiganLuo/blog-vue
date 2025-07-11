<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";

import { getArticleListByTagId, getArticleListByCategoryId } from "@/api/article";

import SkeletonItem from "@/components/SkeletonItem/skeleton-item.vue";
import Tooltip from "@/components/ToolTip/index.vue";
import Pagination from "@/components/Pagination/pagination.vue";
import PageHeader from "@/components/PageHeader/index.vue";

// 接口返回类型定义
interface Article {
  id: string;
  article_cover: string;
  article_title: string;
  createdAt: string;
}

interface ArticleListResponse {
  code: number;
  result: {
    list: Article[];
    total: number;
  };
}

interface PaginationParam {
  current: number;
  size: number;
  id: string;
}

const router = useRouter();

const articleList = ref<Article[]>([]);
const currentType = ref<string | null>(null);
const currentName = ref<string | null>(null);
const loading = ref<boolean>(false);

const param = reactive<PaginationParam>({
  current: 1,
  size: 4,
  id: "",
});

const total = ref<number>(0);
const layout = "prev, pager, next";

// 分页切换
const pagination = (page: { current: number }) => {
  param.current = page.current;
  getArticleListById();
};

// 跳转详情
const gotoDetail = (id: string) => {
  router.push({ path: "/article", query: { id } });
};

// 获取文章列表
const getArticleListById = async () => {
  let res: ArticleListResponse;
  loading.value = true;

  if (currentType.value === "tag") {
    res = await getArticleListByTagId(param);
  } else {
    res = await getArticleListByCategoryId(param);
  }

  if (res.code === 0) {
    articleList.value = res.result.list;
    total.value = res.result.total;
  }

  loading.value = false;
};

// 页面初始化
onMounted(() => {
  const { id, type, name } = router.currentRoute.value.query;
  param.id = String(id);
  currentType.value = String(type);
  currentName.value = String(name);
  getArticleListById();
});
</script>

<template>
  <PageHeader :loading="loading" />
  <div class="center_box">
    <el-card class="article-list">
      <el-skeleton v-if="loading" :loading="loading" animated>
        <template #template>
          <div class="flex_r_between">
            <SkeletonItem variant="text" width="10rem" height="4rem" />
            <SkeletonItem variant="text" width="8rem" height="2rem" />
          </div>
          <div class="flex_r_between skeleton-item">
            <div v-for="i in 4" :key="i">
              <SkeletonItem variant="image" width="15rem" height="6rem" />
              <SkeletonItem variant="text" width="12rem" top="1rem" height="20px" />
              <SkeletonItem variant="text" width="14rem" top="1.5rem" height="15px" />
            </div>
          </div>
        </template>
      </el-skeleton>
      <template v-else>
        <div class="article-list__head flex_r_between flex-wrap">
          <div class="article-list__head-type">
            {{ currentType == "tag" ? "标签 - " + currentName : "分类 - " + currentName }}
          </div>
          <div class="article-list__head-total">文章总数：{{ total }}</div>
        </div>
        <el-row>
          <el-col :xs="12" :sm="8" :md="6" v-for="(item, index) in articleList" :key="index">
            <el-card class="card-hover" @click="gotoDetail(item.id)">
              <div v-image="item.article_cover" class="article-img scale">
                <el-image
                  class="w-[100%] h-[100%] scale animate__animated animate__fadeInDown"
                  fit="cover"
                  :src="item.article_cover"
                >
                  <template #error>
                    <svg-icon name="image404" :width="8" :height="8"></svg-icon>
                  </template>
                </el-image>
              </div>
              <div class="article-title">
                <Tooltip :name="item.article_title" size="1.2rem" color="#676767" />
                <Tooltip :name="item.createdAt" size="1rem" color="#676767" />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </template>
    </el-card>
    <Pagination
      :size="param.size"
      :current="param.current"
      :layout="layout"
      :total="total"
      @pagination="pagination"
    />
  </div>
</template>

<style lang="scss" scoped>
.article-list {
  padding: 40px 30px;
  width: 100%;
  color: var(--font-color);

  &__head {
    font-size: 1.6rem;
    line-height: 1.7;
    font-weight: 600;

    &-total {
      font-size: 1.2rem;
    }
  }

  .article {
    &-title {
      font-size: 1.2rem;
      height: 5rem;
      padding: 0.8rem 0.5rem;
      line-height: 1.8;
    }

    &-img {
      width: 100%;
      object-fit: fill;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &-time {
      font-size: 1rem;
      line-height: 1.4;
      color: var(--second-font-color);
    }
  }
}
.skeleton-item {
  margin-top: 1rem;
}
@media screen and (min-width: 768px) {
  .article-img {
    height: 8rem;
  }
}

@media screen and (max-width: 768px) {
  .article-img {
    height: 8rem;
  }
}
</style>
