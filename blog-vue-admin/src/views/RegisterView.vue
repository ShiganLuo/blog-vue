<template>
  <div class="register-container">
    <div class="register-form">
      <h1>注册账号</h1>
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
      <div class="form-group">
        <label for="username">用户名</label>
        <input 
          type="text" 
          id="username" 
          v-model="registerForm.username" 
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input 
          type="password" 
          id="password" 
          v-model="registerForm.password" 
          placeholder="请输入密码"
        />
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码</label>
        <input 
          type="password" 
          id="confirmPassword" 
          v-model="registerForm.confirmPassword" 
          placeholder="请再次输入密码"
        />
      </div>
      <div class="form-actions">
        <button 
          @click="handleRegister" 
          class="btn-register"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
        <button @click="goToLogin" class="btn-back" :disabled="authStore.loading">返回登录</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

const handleRegister = async () => {
  // 表单验证
  if (!registerForm.username || !registerForm.password) {
    alert('请输入用户名和密码')
    return
  }
  
  if (registerForm.password !== registerForm.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  // 调用API注册
  const success = await authStore.register({
    username: registerForm.username,
    password: registerForm.password
  })
  
  if (success) {
    alert('注册成功，请登录')
    router.push('/login')
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
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
}

.btn-register {
  background-color: #4caf50;
  color: white;
  flex: 1;
  margin-right: 10px;
}

.btn-back {
  background-color: #9e9e9e;
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
</style> 