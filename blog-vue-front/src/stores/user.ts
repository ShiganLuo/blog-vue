// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, refreshTokenApi } from '@/api/user'
// 定义用户信息类型
interface UserInfo {
  accessToken: string;
  refreshToken: string;
  expires: Date;
  avatar: string;
  username: string;
  nickname: string;
  roles: string;
}

export const useUserStore = defineStore('user', () => {
  // 1. 状态
  const isLoggedIn = ref(false)
  const userInfo = ref<UserInfo | null>(null)

  // 2. 计算属性
  const username = computed(() => userInfo.value?.username || '')

  // 3. 行为（方法）
  /**登录 */
  async function getLogin(username: string, password: string) {
    await login({ username, password })
      .then((response) => {
        const { accessToken, refreshToken, expires, avatar, nickname, roles } = response
        const newUserInfo: UserInfo = {
          accessToken,
          refreshToken,
          expires: new Date(expires),
          avatar,
          username,
          nickname,
          roles,
        }
        const newToken = accessToken
        // 存储用户信息和token
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
        localStorage.setItem('token', newToken)
        isLoggedIn.value = true
      })
      .catch((error) => {
        console.error('Login failed:', error)
      })
  }
  /**刷新token */
  async function handRefreshToken() {
    await refreshTokenApi()
      .then((response) => {
        const { accessToken, refreshToken, expires } = response
        const newUserInfo: UserInfo = {
          ...userInfo.value!,
          accessToken,
          refreshToken,
          expires: new Date(expires),
        }
        const newToken = accessToken
        // 更新用户信息和token
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo))
        localStorage.setItem('token', newToken)
      }
      )
      .catch((error) => {
        console.error('Refresh token failed:', error)
      }
      )
  }
  function init(){
    isLoggedIn.value = false
    userInfo.value = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }



  function logout() {
    isLoggedIn.value = false
    userInfo.value = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }


  return {
    isLoggedIn,
    userInfo,
    username,
    getLogin,
    logout,
    init,
    handRefreshToken,
  }
})
