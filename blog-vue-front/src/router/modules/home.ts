import type { RouteRecordRaw } from 'vue-router'
import Layout from '../../layout/index.vue'
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    meta: {
      name: "Layout",
    },
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: '/home',
        name: 'Home', // 路由唯一标识
        component: () => import('@/views/home/HomeView.vue'), // 懒加载组件
          meta: {
            title: '首页', // 页面标题
            requiresAuth: true, // 需要登录
            icon: 'i-carbon-home' // 菜单图标（使用Unocss图标）
          }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
          meta: {
            keepAlive: true // 缓存页面
          }
      },
      {
        path: "/article",
        name: "Article",
        meta: {
          name: "文章",
        },
        component: () => import("@/views/article/article.vue"),
      },
      {
        path: "/articleList",
        name: "ArticleList",
        meta: {
          name: "文章列表",
        },
        component: () => import("@/views/article/article-list.vue"),
      },
    ]
  }

]

export default routes
