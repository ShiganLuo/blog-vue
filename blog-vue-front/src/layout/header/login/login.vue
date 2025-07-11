<script setup lang="ts">
import { ref, reactive, watch, h, nextTick } from "vue";
import type { FormInstance, FormRules, FormItemRule } from "element-plus";
import { ElNotification } from "element-plus";
import { reqLogin, reqRegister, getUserInfoById } from "@/api/user";
import { useUserStore } from "@/stores/index";
import { storeToRefs } from "pinia";
import { getWelcomeSay, _getLocalItem, _setLocalItem, _removeLocalItem } from "@/utils/tool";
import blogAvatar from "@/assets/img/blogAvatar.png";
import { _encrypt, _decrypt } from "@/utils/encipher";

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password1: string;
  password2: string;
  nick_name: string;
}

const userStore = useUserStore();
const { getShowLogin } = storeToRefs(userStore);

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<LoginForm>({ username: "", password: "" });
const primaryLoginForm: LoginForm = { username: "", password: "" };

const isRemember = ref<boolean>(false);
const registerFormRef = ref<FormInstance>();
const registerForm = reactive<RegisterForm>({
  username: "",
  password1: "",
  password2: "",
  nick_name: "",
});
const primaryRegisterForm: RegisterForm = { username: "", password1: "", password2: "", nick_name: "" };

const isLogin = ref<boolean>(true);
const showDialog = ref<boolean>(false);

const usernameV: FormItemRule["validator"] = (rule, value, cb) => {
  if (!value) cb(new Error("请输入用户账号"));
  else if (value.length > 16 || value.length < 5) cb(new Error("用户账号长度应该在5-16之间"));
  else cb();
};

const REGEXP_PWD = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,18}$/;

const password1V: FormItemRule["validator"] = (rule, value, cb) => {
  if (!value) cb(new Error("请输入密码"));
  else if (!REGEXP_PWD.test(value)) cb(new Error("密码格式应为6-18位数字、字母、符号的任意两种组合"));
  else cb();
};

const password2V: FormItemRule["validator"] = (rule, value, cb) => {
  if (!value) cb(new Error("请输入二次确认密码"));
  else if (value !== registerForm.password1) cb(new Error("两次密码不一致"));
  else cb();
};

const loginRules: FormRules = {
  username: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
  password: [{ required: true, message: "请输入用户密码", trigger: "blur" }],
};

const registerRules: FormRules = {
  username: [{ required: true, validator: usernameV, trigger: "blur" }],
  password1: [{ required: true, validator: password1V, trigger: "blur" }],
  password2: [{ required: true, validator: password2V, trigger: "blur" }],
};

const welcome = (id: number, nick_name: string) => {
  let msg = getWelcomeSay(nick_name);
  if (id === 3) msg = "小婷光临，真是三生有幸";
  ElNotification({
    offset: 60,
    title: "欢迎～",
    message: h("div", { style: "font-weight: 600;" }, msg),
  });
};

const userRegister = async () => {
  await registerFormRef.value?.validate(async (valid) => {
    if (valid) {
      const register = {
        username: registerForm.username,
        password: registerForm.password1,
        nick_name: registerForm.nick_name,
      };
      const res = await reqRegister(register);
      if (res?.code === 0) {
        await userLogin("register");
      } else {
        ElNotification({ offset: 60, title: "错误提示", message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message) });
      }
    }
  });
};

const userLogin = async (type?: "register") => {
  if (type === "register") {
    const loginForm = {
      username: registerForm.username,
      password: registerForm.password1,
    };
    await onLogin(loginForm, "register");
  } else {
    await loginFormRef.value?.validate(async (valid) => {
      if (valid) await onLogin(loginForm);
    });
  }
};

const onLogin = async (form: LoginForm, type: "login" | "register" = "login") => {
  const res = await reqLogin(form);
  if (res?.code === 200) {
    await userStore.setToken(res.result.token);
    if (type === "register" || isRemember.value) {
      _setLocalItem("loginForm", _encrypt(form));
    } else {
      _removeLocalItem("loginForm");
    }
    ElNotification({ offset: 60, title: "提示", message: h("div", { style: "color: #7ec050; font-weight: 600;" }, type === "login" ? "登录成功" : "自动登录成功") });
    const userRes = await getUserInfoById(res.result.id);
    if (userRes.code === 0) {
      await userStore.setUserInfo(userRes.result);
      Object.assign(loginForm, primaryLoginForm);
      Object.assign(registerForm, primaryRegisterForm);
      handleClose();
      await welcome(userRes.result.id, userRes.result.nick_name);
    } else {
      ElNotification({ offset: 60, title: "错误提示", message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, userRes.message) });
    }
  } else {
    ElNotification({ offset: 60, title: "错误提示", message: h("div", { style: "color: #f56c6c; font-weight: 600;" }, res.message) });
  }
};

const toLogin = () => (isLogin.value = true);
const toRegister = () => (isLogin.value = false);
const submit = async () => (isLogin.value ? await userLogin() : await userRegister());
const handleClose = () => userStore.setShowLogin(false);

watch(
  () => isLogin.value,
  (newV) => {
    if (newV) loginFormRef.value?.resetFields();
    else registerFormRef.value?.resetFields();
  },
  { immediate: true }
);

watch(
  () => getShowLogin.value,
  (newV) => {
    showDialog.value = newV;
    if (newV) {
      isLogin.value = true;
      nextTick(() => {
        loginFormRef.value?.resetFields();
        registerFormRef.value?.resetFields();
        const form = _decrypt(_getLocalItem("loginForm"));
        if (form) {
          isRemember.value = true;
          Object.assign(loginForm, JSON.parse(form));
        }
      });
    }
  },
  { immediate: true }
);
</script>

<template>
  <el-dialog v-model="showDialog" width="120" :before-close="handleClose">
    <template #header>
      <h1>{{ isLogin ? "登录" : "注册" }}</h1>
    </template>
    <div class="login-box flex flex-col justify-between">
      <div class="flex justify-between items-center !w-[100%]">
        <div v-if="isLogin" class="no-account">
          没有账号？<span class="line" @click="toRegister">去注册</span>
        </div>
        <div v-else class="no-account">
          已有账号？<span class="line" @click="toLogin">去登录</span>
        </div>
      </div>
      <el-form
        v-if="isLogin"
        class="login-register-form"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
      >
        <div class="!w-[100%] !h-[6rem]">
          <el-image style="width: 80px; height: 80px" :src="blogAvatar" fit="cover" />
        </div>
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :style="{ width: '100%' }"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-form-item prop="password" @keyup.enter="submit">
          <el-input
            v-model="loginForm.password"
            show-password
            :style="{ width: '100%' }"
            placeholder="请输入密码"
            clearable
          />
        </el-form-item>
        <el-form-item class="remember-me">
          <div class="flex justify-between items-center w-[100%]">
            <el-checkbox v-model="isRemember">记住我</el-checkbox>
            <span></span>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        v-else
        class="login-register-form"
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
      >
        <el-form-item prop="username">
          <el-input
            v-model="registerForm.username"
            :style="{ width: '100%' }"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.nick_name"
            :style="{ width: '199%' }"
            placeholder="请输入昵称"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password1">
          <el-input
            show-password
            v-model="registerForm.password1"
            :style="{ width: '100%' }"
            placeholder="请输入密码"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password2">
          <el-input
            show-password
            v-model="registerForm.password2"
            :style="{ width: '100%' }"
            placeholder="确认密码"
            clearable
            @keyup.enter="submit"
          />
        </el-form-item>
      </el-form>
      <div v-if="isLogin" class="flex justify-between items-center w-[100%] mb-3">
        <span class="apply-button" @click="submit">登录</span>
      </div>
      <div v-else class="flex justify-between items-center w-[100%] mb-3">
        <span class="apply-button" @click="submit">注册</span>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.login-register {
  &-form {
    width: 100%;
  }
}
.apply-button {
  width: 100%;
  text-align: center;
}
.line {
  cursor: pointer;
  text-decoration: underline;
}
.no-account {
  font-size: 1rem;
}

:deep(.el-form-item) {
  padding: 15px 0;
}

:deep(.el-input__wrapper) {
  height: 40px;
  line-height: 40px;
}

.remember-me {
  padding: 0;
}

// pc
@media screen and (min-width: 768px) {
  .login-box {
    height: 50vh !important;
  }
}

// mobile
@media screen and (max-width: 768px) {
  .login-register-box {
    width: 80%;
  }

  .login-box {
    height: 88vh !important;
  }
}
</style>
