import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as authApi from '../api/auth'

interface User {
  username: string;
  id?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 初始化时从本地存储加载用户信息
  async function init() {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    
    if (storedUser && storedToken) {
      try {
        // 直接使用本地存储的信息，不进行验证
        user.value = JSON.parse(storedUser)
        token.value = storedToken
        isAuthenticated.value = true
        
        // 在后台异步验证token，不阻塞UI
        validateTokenInBackground(storedToken)
      } catch (error) {
        console.error('用户信息解析失败', error)
        logout()
      }
    }
  }
  
  // 在后台验证token
  async function validateTokenInBackground(storedToken: string) {
    try {
      const response = await authApi.verifyToken(storedToken)
      if (!response.valid) {
        console.warn('Token 失效，清除本地存储')
        logout()
      }
    } catch (err) {
      console.error('Token 验证失败', err)
      // 验证失败时不一定要登出，可以在下次操作时再验证
    }
  }

  // 登录
  async function login(credentials: { username: string; password: string }) {
    loading.value = true
    error.value = null
    
    try {
      const response = await authApi.login(credentials)
      
      user.value = response.result.user
      token.value = response.result.token
      isAuthenticated.value = true
      
      // 保存到本地存储
      localStorage.setItem('user', JSON.stringify(response.result.user))
      localStorage.setItem('token', response.result.token)
      
      return true
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '登录失败'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // 注册
  async function register(userData: { username: string; password: string }) {
    loading.value = true
    error.value = null
    
    try {
      await authApi.register(userData)
      return true
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = '注册失败'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  // 注销
  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return {
    user,
    isAuthenticated,
    token,
    loading,
    error,
    init,
    login,
    register,
    logout
  }
}) 