export default {
  path: "/article",
  name: "article",
  component: () => import("@/views/article/index.vue"),
  redirect: "/article/article-manage",
  meta: {
    icon: "ep:document",
    title: "文章管理",
    rank: 2
  },
  children: [
    {
      path: "/article/article-manage",
      name: "article-manage",
      component: () => import("@/views/article/index.vue"),
      meta: {
        title: "文章管理"
      }
    }
    // {
    //   path: "/article/article-edit",
    //   name: "article-edit",
    //   component: () => import("@/views/article/components/ArticleEdit.vue"),
    //   meta: {
    //     title: "文章编辑"
    //   }
    // }
  ]
} satisfies RouteConfigsTable;
