<template>
  <div class="login-container">
    <div class="login-form">
      <h1>博客管理系统</h1>
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      <div v-if="localError" class="error-message">
        {{ localError }}
      </div>
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="loginForm.username" 
          placeholder="请输入用户名"
          :disabled="authStore.loading"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="loginForm.password" 
          placeholder="请输入密码"
          @keyup.enter="handleLogin"
          :disabled="authStore.loading"
        />
      </div>
      <div class="form-actions">
        <button 
          @click="handleLogin" 
          class="btn-login" 
          :disabled="authStore.loading || isFormInvalid"
        >
          <span v-if="authStore.loading" class="loading-spinner"></span>
          <span>{{ authStore.loading ? '登录中...' : '登录' }}</span>
        </button>
        <button @click="goToRegister" class="btn-register" :disabled="authStore.loading">注册账号</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const localError = ref('')

const loginForm = reactive({
  username: '',
  password: ''
})

// 计算属性：表单是否无效
const isFormInvalid = computed(() => {
  return !loginForm.username || !loginForm.password
})

const handleLogin = async () => {
  if (isFormInvalid.value) {
    localError.value = '请输入用户名和密码'
    return
  }

  localError.value = ''
  
  try {
    const success = await authStore.login({
      username: loginForm.username,
      password: loginForm.password
    })

    if (success) {
      router.push('/')
    }
  } catch (error) {
    console.error('登录过程中发生错误:', error)
    localError.value = '登录过程中发生错误，请稍后再试'
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #f5f5f5;
}

.login-form {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-login {
  background-color: #4caf50;
  color: white;
  flex: 1;
  margin-right: 10px;
}

.btn-register {
  background-color: #2196f3;
  color: white;
  flex: 1;
  margin-left: 10px;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style> 