<template>
  <div :class="['container-wrapper', { 'dark-mode': isDarkMode }]">
    <!-- 暗黑模式切换按钮 -->
    <button class="dark-toggle" @click="toggleDarkMode">
      {{ isDarkMode ? "🌞" : "🌙" }}
    </button>

    <div class="container">
      <!-- Left Section -->
      <div class="left-section">
        <div class="content">
          <h1 class="title">LOG IN<span class="title-dot">.</span></h1>

          <!-- Form -->
          <form class="form" @submit.prevent="handleSubmit">
            <!-- Account -->
            <div class="input-group">
              <label class="input-label">Account</label>
              <div class="input-wrapper">
                <input
                  autofocus
                  class="input-field"
                  v-model="account"
                  @focus="handleFocus($event)"
                  @blur="handleBlur($event)"
                />
                <span class="input-icon"><span class="mdi-light--account"></span></span>
              </div>
            </div>

            <!-- Password -->
            <div class="input-group">
              <label class="input-label">Password</label>
              <div class="input-wrapper">
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="input-field password-field"
                  v-model="password"
                  @focus="handleFocus($event)"
                  @blur="handleBlur($event)"
                />
                <span class="input-icon" @click="togglePassword">
                  {{ showPassword ? "👁‍🗨" : "👁" }}
                </span>
              </div>
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button type="submit" class="login-button">
                <span>Log In</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <div class="divider-line">
          <svg viewBox="0 0 2 900" preserveAspectRatio="none">
            <path
              d="M 1 0 Q 1 150, 1 300 T 1 600 T 1 900"
              stroke="#d0d0d0"
              stroke-width="2"
              stroke-dasharray="8,8"
              fill="none"
            />
          </svg>
        </div>

        <div class="image-container">
          <img
            src="https://w.wallhaven.cc/full/qr/wallhaven-qr27rq.jpg"
            alt="Mountain Lake"
            class="mountain-image"
          />
        </div>

        <div class="image-logo">
          <div class="logo-shape">
            <div class="logo-dot"></div>
            <div class="logo-bars">
              <div class="logo-bar"></div>
              <div class="logo-bar"></div>
              <div class="logo-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/pinia";

const userStore = useUserStore();
const { $toast } = useNuxtApp();

const router = useRouter();
const account = ref("admin");
const password = ref("123456");
const showPassword = ref(false);
const isDarkMode = ref(false);

// 暗黑模式切换
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value ? "1" : "0");
}

onMounted(() => {
  isDarkMode.value = localStorage.getItem("darkMode") === "1";
});

function togglePassword() {
  showPassword.value = !showPassword.value;
}

const handleSubmit = async () => {
  if (!account.value || !password.value) {
    $toast?.warning("账号或密码为空！");
    return;
  }
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
};

// Focus effects
function handleFocus(e: FocusEvent) {
  (e.target as HTMLElement).parentElement!.parentElement!.style.transform =
    "translateY(-2px)";
}
function handleBlur(e: FocusEvent) {
  (e.target as HTMLElement).parentElement!.parentElement!.style.transform =
    "translateY(0)";
}
</script>

<style scoped>
/* ===== Container & Dark Mode ===== */
.container-wrapper {
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  position: relative;
  transition: background-color 0.3s, color 0.3s;
  width: 100vw;
}

.dark-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  background: #e0e0e0;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 1000;
  font-size: 16px;
}

.dark-mode {
  background-color: #1a1a1a;
  color: #f5f5f5;
}

.dark-mode .container {
  background-color: #2c2c2c;
}

.dark-mode .title {
  color: #f5f5f5;
}

.dark-mode .title-dot {
  color: #42a5f5;
}

.dark-mode .input-field {
  background-color: #3a3a3a;
  color: #f5f5f5;
  border-color: #555;
}

.dark-mode .input-field:focus {
  background-color: #2c2c2c;
  border-color: #4285f4;
}

.dark-mode .password-field {
  border-color: #00bcd4;
}

.dark-mode .login-button {
  background-color: #3d405b;
  color: #f5f5f5;
}

.dark-mode .divider-line path {
  stroke: #555;
}

.dark-mode .logo-dot,
.dark-mode .logo-bar {
  background: #f5f5f5;
}

.dark-mode .mountain-image {
  filter: brightness(0.7) contrast(1.2);
}

/* ===== Container ===== */
.container {
  width: 100%;
  max-width: 800px;
  border-radius: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  position: relative;
}

/* Left Section */
.left-section {
  padding: 60px 80px;
  position: relative;
  z-index: 2;
}

.content {
  margin-top: 80px;
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.title-dot {
  color: #4285f4;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  position: relative;
}

.input-label {
  font-size: 12px;
  color: #9e9e9e;
  margin-bottom: 8px;
  display: block;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 8px 48px 8px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #000;
  background: #fafafa;
  transition: all 0.3s;
  outline: none;
}

.input-field:focus {
  border-color: #4285f4;
  background: white;
}

.input-icon {
  position: absolute;
  right: 16px;
  color: #b0b0b0;
  cursor: pointer;
  font-size: 18px;
}

.button-group {
  display: flex;
  gap: 16px;
  justify-content: center;
}

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

/* Right Section */
.right-section {
  position: relative;
  overflow: visible;
}

.image-container {
  position: absolute;
  top: 0;
  right: -40px;
  bottom: -40px;
  width: 100%;
  clip-path: path(
    "M296 0 C50 88,338 114,169 185 S327 288,170 344 S131 383,27 481 S190 581,177 638 S205 750,200 800 L400 900 L400 0 Z"
  );
}

.mountain-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s;
}

.divider-line {
  position: absolute;
  top: 0;
  left: -2px;
  width: 2px;
  height: 100%;
  z-index: 1;
}

.divider-line svg {
  width: 100%;
  height: 100%;
}

.image-logo {
  position: absolute;
  bottom: 60px;
  right: 60px;
  z-index: 3;
}

.logo-shape {
  display: flex;
  gap: 8px;
  align-items: center;
}

.logo-dot {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
}

.logo-bars {
  display: flex;
  gap: 4px;
}

.logo-bar {
  width: 8px;
  height: 32px;
  background: white;
  transform: skewX(-10deg);
}

@media (max-width: 968px) {
  .container {
    grid-template-columns: 1fr;
  }

  .right-section {
    display: none;
  }

  .left-section {
    padding: 40px;
  }
}
</style>
