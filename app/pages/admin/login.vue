<template>
  <div :class="['layout', darkMode ? 'dark' : 'light']">
    <!-- 黑暗模式开关 -->
    <div class="dark-toggle">
      <label class="switch">
        <input type="checkbox" v-model="darkMode" />
        <span class="slider"></span>
      </label>
    </div>

    <!-- 萤火虫层 -->
    <div class="firefly-layer"></div>

    <!-- 左侧文字 -->
    <div class="left">
      <div>Welcome to log in!</div>
      <div class="text">你发现了神秘的登录入口</div>
    </div>

    <!-- 右侧登录框 -->
    <div class="right">
      <div class="container">
        <div class="heading">登录你的账号</div>
        <form class="form" @submit.prevent="handleSubmit">
          <!-- 账号 -->
          <div class="input-field">
            <input
              v-model="username"
              required
              autocomplete="off"
              type="text"
              id="username"
              :class="{ error: errors.username }"
              @blur="validateField('username')"
            />
            <label v-if="!username" for="username">账号</label>
          </div>

          <!-- 密码 -->
          <div class="input-field">
            <input
              v-model="password"
              required
              autocomplete="off"
              :type="showPassword ? 'text' : 'password'"
              id="password"
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
import { ref, reactive, watch, nextTick } from "vue";

const username = ref("");
const password = ref("");
const showPassword = ref(false);
const darkMode = ref(false);
const errors = reactive({
  username: "",
  password: "",
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

// 简单校验逻辑
function validateField(field: "username" | "password") {
  if (field === "username") {
    if (!username.value.trim()) {
      errors.username = "请输入账号";
    } else {
      errors.username = "";
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

function handleSubmit() {
  validateField("username");
  validateField("password");

  if (errors.username || errors.password) return;

  alert(`用户名: ${username.value}\n密码: ${password.value}`);
}

// 萤火虫生成
function createFireflies() {
  const fireflyLayer = document.querySelector(".firefly-layer");
  if (!fireflyLayer) return;
  fireflyLayer.innerHTML = "";

  const count = 30;
  for (let i = 0; i < count; i++) {
    const f = document.createElement("div");
    f.className = "firefly";
    f.style.left = Math.random() * 100 + "%";
    f.style.top = Math.random() * 100 + "%";
    f.style.width = 2 + Math.random() * 3 + "px";
    f.style.height = f.style.width;
    f.style.animationDuration = 5 + Math.random() * 10 + "s";
    f.style.animationDelay = Math.random() * 5 + "s";
    f.style.opacity = 0.3 + Math.random() * 0.7 + "";
    fireflyLayer.appendChild(f);
  }
}

watch(darkMode, (val) => {
  nextTick(() => {
    if (val) createFireflies();
    else {
      const layer = document.querySelector(".firefly-layer");
      if (layer) layer.innerHTML = "";
    }
  });
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

.left,
.right {
  flex: 1 1 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.left .text {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

/* 保留你原来的登录框样式 */
/* From Uiverse.io by Spacious74 */
.container {
  border: solid 1px #8d8d8d;
  padding: 20px;
  border-radius: 20px;
  background-color: #fff;
  width: auto;
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
}

/* From Uiverse.io by NorthFishHasNa */
.login-button {
  display: inline-block;
  border-radius: 4px;
  background-color: #3d405b;
  border: none;
  color: #ffffff;
  text-align: center;
  font-size: 17px;
  padding: 7px;
  width: 130px;
  transition: all 0.5s;
  cursor: pointer;
  margin: 5px;
}

button span {
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: 0.5s;
}

.login-button span:after {
  content: "»";
  position: absolute;
  opacity: 0;
  top: 0;
  right: -15px;
  transition: 0.5s;
}

.login-button:hover span {
  padding-right: 15px;
}

.login-button:hover span:after {
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
  background-color: #f5f5f5; /* 可以加一个浅灰背景区分输入框 */
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

/* 萤火虫 */
.firefly-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.firefly {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, #ffffaa, transparent 70%);
  animation-name: float;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes float {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0.5;
  }
  25% {
    transform: translate(calc(30px - 15px), calc(20px - 10px)) scale(0.7);
    opacity: 0.3;
  }
  50% {
    transform: translate(calc(-30px + 15px), calc(25px - 12px)) scale(1);
    opacity: 0.6;
  }
  75% {
    transform: translate(calc(20px - 10px), calc(-20px + 10px)) scale(0.7);
    opacity: 0.4;
  }
  100% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0.5;
  }
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
