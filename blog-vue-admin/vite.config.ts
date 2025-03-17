import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      // 将请求代理到后端API
      '/api': {
        target: 'http://localhost:8080', // 后端地址
        changeOrigin: true, // 修改请求头中的Origin字段，避免跨域问题
        secure: false, // 如果是https接口，设置为true
        // rewrite: (path) => path.replace(/^\/api/, ''), // 可选：将请求路径的 `/api` 部分删除
      },
    },
  },
})
