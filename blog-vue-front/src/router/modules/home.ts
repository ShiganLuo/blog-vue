import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home', // 路由唯一标识
    component: () => import('@/views/HomeView.vue'), // 懒加载组件
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
  }
]

export default routes