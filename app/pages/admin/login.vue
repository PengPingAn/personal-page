<template>
  <div :class="['layout', darkMode ? 'dark' : 'light']">
    <!-- 黑暗模式开关 -->
    <div class="dark-toggle">
      <label class="switch">
        <input type="checkbox" v-model="darkMode" @click="toggleDarkMode" />
        <span class="slider"></span>
      </label>
    </div>

    <!-- 左侧文字 -->
    <div class="left">
      <div>Welcome to log in!</div>
      <div class="text">你发现了神秘的登录入口</div>
    </div>

    <!-- 右侧登录框 -->
    <div class="right">
      <FlickeringGrid
        class="absolute inset-0"
        :quantity="100"
        :ease="100"
        :color="darkMode ? '#FFF' : '#000'"
        :staticity="10"
        refresh
      />
      <div class="container">
        <div class="heading">登录你的账号</div>
        <form class="form" @submit.prevent="handleSubmit">
          <!-- 账号 -->
          <div class="input-field">
            <input
              v-model="account"
              required
              autocomplete="off"
              type="text"
              :class="{ error: errors.account }"
              @blur="validateField('account')"
            />
            <label v-if="!account" for="account">账号</label>
          </div>

          <!-- 密码 -->
          <div class="input-field">
            <input
              v-model="password"
              required
              autocomplete="off"
              :type="showPassword ? 'text' : 'password'"
              :class="{ error: errors.password }"
              @blur="validateField('password')"
            />
            <label for="password" v-if="!password">密码</label>
            <span class="passicon" @click="togglePassword">{{
              showPassword ? "🙈" : "👁️"
            }}</span>
          </div>

          <div class="btn-container">
            <button class="login-button">
              <span>登录</span>
            </button>
            <div class="acc-text">
              没有账号?
              <span style="color: #0000ff; cursor: pointer">点击注册</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/pinia";

const userStore = useUserStore();
const { $toast } = useNuxtApp();

const router = useRouter();
const account = ref("admin");
const password = ref("123456");
const showPassword = ref(false);
const darkMode = ref(false);
const errors = reactive({
  account: "",
  password: "",
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

function toggleDarkMode() {
  darkMode.value = !darkMode.value;
  localStorage.setItem("darkMode", darkMode.value ? "1" : "0");
}

// 简单校验逻辑
function validateField(field: "account" | "password") {
  if (field === "account") {
    if (!account.value.trim()) {
      errors.account = "请输入账号";
    } else {
      errors.account = "";
    }
  }

  if (field === "password") {
    if (!password.value.trim()) {
      errors.password = "请输入密码";
    } else {
      errors.password = "";
    }
  }
}

async function handleSubmit() {
  validateField("account");
  validateField("password");

  if (errors.account || errors.password) return;

  try {
    let res = await $request.Post("/auth/login", {
      account: account.value,
      password: password.value,
    });
    if (res.code === 200) {
      $toast?.success("登录成功，正在进入系统！");
      userStore.setToken(res.data.token);
      userStore.setHead(res.data.head);
      setTimeout(() => {
        router.push("/admin/layout");
      }, 500);
    }
  } catch (err: any) {
    console.error("请求失败:", err.message);
  }
}

onMounted(() => {
  darkMode.value = localStorage.getItem("darkMode") === "1";
});
</script>

<style scoped>
/* 页面布局 */
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  transition: background 0.5s, color 0.5s;
  position: relative;
  background-color: #fff;
}

.left {
  display: flex;
  justify-items: unset;
  flex-direction: column;
  gap: 1rem;
}

.left::before {
  content: "";
  position: absolute;
  top: 15%;
  left: 0;
  width: 280px;
  height: 100px;
  background: linear-gradient(to right, var(--primary-color), #c471ed, #f64f59);
  z-index: -1;
  filter: blur(70px);
}

.left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
.left .text {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  border-radius: 20px;
  padding: 30px;
  width: 320px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: background 0.5s, color 0.5s;
}

.container .heading {
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: bolder;
}

.form {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form .btn-container {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-direction: column;
}

.login-button {
  display: inline-block;
  border-radius: 5px;
  background-color: #3d405b;
  border: none;
  color: #fff;
  font-size: 1rem;
  padding: 10px 0;
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
}

.login-button span {
  position: relative;
  transition: 0.3s;
}

.login-button span::after {
  content: "»";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -15px;
  transition: 0.3s;
}

.login-button:hover span {
  padding-right: 15px;
}

.login-button:hover span::after {
  opacity: 1;
  right: 0;
}

.input-field {
  position: relative;
  margin-bottom: 4px;
  border: 0px;
}

.input-field label {
  position: absolute;
  color: #8d8d8d;
  pointer-events: none;
  background-color: transparent;
  left: 15px;
  transform: translateY(0.6rem);
  transition: all 0.3s ease;
}

.input-field input {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 8px;
  border: none; /* 去掉边框 */
  letter-spacing: 1px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  background: transparent;
  border: 1px solid rgba(86, 255, 77, 0.5) !important;
  box-shadow: 0 0 4px rgba(86, 255, 77, 0.5);
}

.input-field input:focus,
.input-field input:valid {
  outline: none;
  /* 可选：聚焦时加个阴影而不是边框 */
  box-shadow: 0 0 0 2px #0034de33;
}

.input-field input.error {
  /* 错误状态用阴影提示 */
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
}

.form .passicon {
  cursor: pointer;
  font-size: 1.3rem;
  position: absolute;
  top: 6px;
  right: 8px;
}

.form .close {
  display: none;
}

.input-field input.error {
  border: 1px solid #ff4d4f !important;
  box-shadow: 0 0 4px rgba(255, 77, 79, 0.5);
}

/* 黑暗模式 */
.dark {
  background-color: #0b0c1c;
  color: #fff;
}

.dark .container {
  background-color: rgba(0, 0, 30, 0.85);
  color: #fff;
  border: 1px solid #555;
}

.dark .error-msg {
  color: #ff777a;
}

/* 黑暗模式开关 */
.dark-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  background: rgba(255, 255, 255, 0.2);
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: bold;
  color: #fff;
  backdrop-filter: blur(5px);
}
.light .dark-toggle {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* From Uiverse.io by martinval9 */
.switch {
  font-size: 11px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 1em;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border: 2px solid #000;
  transition: 0.4s;
  border-radius: 1px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.3em;
  width: 1.2em;
  border-radius: 2px;
  left: 0.2em;
  bottom: 0.3em;
  background-color: #fff;
  border: 2px solid #000;
  transition: 0.1s;
}

input:checked + .slider {
  background-color: #000;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  transform: translateX(1.3em);
}

/* 响应式 */
@media (max-width: 768px) {
  .left {
    display: none;
  }
  .layout {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .right {
    width: 100%;
    max-width: 350px;
  }
}
</style>
