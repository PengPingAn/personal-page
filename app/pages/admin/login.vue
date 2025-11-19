<template>
  <div
    :class="[
      'min-h-screen relative overflow-hidden w-full transition-colors duration-500',
      isDark
        ? 'bg-gray-900'
        : 'bg-gradient-to-br from-blue-100 via-purple-100 to-orange-100',
    ]"
  >
    <!-- 背景圆形 -->
    <div
      class="absolute top-0 left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"
      :class="isDark ? 'bg-gray-700' : 'bg-purple-300'"
    ></div>
    <div
      class="absolute top-0 right-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"
      :class="isDark ? 'bg-gray-800' : 'bg-purple-400'"
    ></div>
    <div
      class="absolute bottom-0 left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"
      :class="isDark ? 'bg-gray-700' : 'bg-purple-300'"
    ></div>
    <div
      class="absolute bottom-20 right-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-6000"
      :class="isDark ? 'bg-gray-600' : 'bg-pink-200'"
    ></div>

    <!-- 主体内容 -->
    <div class="relative min-h-screen flex items-center justify-center p-4 md:p-8 z-10">
      <!-- 玻璃卡片 -->
      <transition name="fly-up">
        <div
          v-if="showContent"
          class="w-full max-w-4xl backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden transition-colors duration-500 p-8 md:p-12"
          :class="
            isDark
              ? 'bg-gray-800/70 border-gray-700/50 text-gray-200'
              : 'bg-white/60 border-white/50 text-gray-800'
          "
        >
          <!-- 切换按钮 -->
          <!-- <button
            @click="toggleDarkMode"
            class="absolute top-4 right-4 py-2 px-4 rounded-lg transition-colors font-medium"
            :class="
              isDark
                ? 'bg-gray-600 text-white hover:bg-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            "
          >
            {{ isDark ? "Light Mode" : "Dark Mode" }}
          </button> -->
          <!-- From Uiverse.io by Galahhad -->
          <label class="theme-switch absolute top-2 -right-4 py-2 px-4">
            <input
              v-model="isDark"
              type="checkbox"
              class="theme-switch__checkbox"
              @click="toggleDarkMode"
            />
            <div class="theme-switch__container">
              <div class="theme-switch__clouds"></div>
              <div class="theme-switch__stars-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688ZM31 23.3545C32.1114 23.2995 33.0551 22.8503 33.8313 22.0069C34.6075 21.1635 34.9956 20.1642 34.9956 19C34.9956 20.1642 35.3837 21.1635 36.1599 22.0069C36.9361 22.8503 37.8798 23.2903 39 23.3545C38.2679 23.3911 37.5976 23.602 36.9802 24.0053C36.3716 24.3995 35.8864 24.9312 35.5248 25.5913C35.172 26.2513 34.9956 26.9572 34.9956 27.7273C34.9956 26.563 34.6075 25.5546 33.8313 24.7112C33.0551 23.8587 32.1114 23.4095 31 23.3545ZM0 36.3545C1.11136 36.2995 2.05513 35.8503 2.83131 35.0069C3.6075 34.1635 3.99559 33.1642 3.99559 32C3.99559 33.1642 4.38368 34.1635 5.15987 35.0069C5.93605 35.8503 6.87982 36.2903 8 36.3545C7.26792 36.3911 6.59757 36.602 5.98015 37.0053C5.37155 37.3995 4.88644 37.9312 4.52481 38.5913C4.172 39.2513 3.99559 39.9572 3.99559 40.7273C3.99559 39.563 3.6075 38.5546 2.83131 37.7112C2.05513 36.8587 1.11136 36.4095 0 36.3545ZM56.8313 24.0069C56.0551 24.8503 55.1114 25.2995 54 25.3545C55.1114 25.4095 56.0551 25.8587 56.8313 26.7112C57.6075 27.5546 57.9956 28.563 57.9956 29.7273C57.9956 28.9572 58.172 28.2513 58.5248 27.5913C58.8864 26.9312 59.3716 26.3995 59.9802 26.0053C60.5976 25.602 61.2679 25.3911 62 25.3545C60.8798 25.2903 59.9361 24.8503 59.1599 24.0069C58.3837 23.1635 57.9956 22.1642 57.9956 21C57.9956 22.1642 57.6075 23.1635 56.8313 24.0069ZM81 25.3545C82.1114 25.2995 83.0551 24.8503 83.8313 24.0069C84.6075 23.1635 84.9956 22.1642 84.9956 21C84.9956 22.1642 85.3837 23.1635 86.1599 24.0069C86.9361 24.8503 87.8798 25.2903 89 25.3545C88.2679 25.3911 87.5976 25.602 86.9802 26.0053C86.3716 26.3995 85.8864 26.9312 85.5248 27.5913C85.172 28.2513 84.9956 28.9572 84.9956 29.7273C84.9956 28.563 84.6075 27.5546 83.8313 26.7112C83.0551 25.8587 82.1114 25.4095 81 25.3545ZM136 36.3545C137.111 36.2995 138.055 35.8503 138.831 35.0069C139.607 34.1635 139.996 33.1642 139.996 32C139.996 33.1642 140.384 34.1635 141.16 35.0069C141.936 35.8503 142.88 36.2903 144 36.3545C143.268 36.3911 142.598 36.602 141.98 37.0053C141.372 37.3995 140.886 37.9312 140.525 38.5913C140.172 39.2513 139.996 39.9572 139.996 40.7273C139.996 39.563 139.607 38.5546 138.831 37.7112C138.055 36.8587 137.111 36.4095 136 36.3545ZM101.831 49.0069C101.055 49.8503 100.111 50.2995 99 50.3545C100.111 50.4095 101.055 50.8587 101.831 51.7112C102.607 52.5546 102.996 53.563 102.996 54.7273C102.996 53.9572 103.172 53.2513 103.525 52.5913C103.886 51.9312 104.372 51.3995 104.98 51.0053C105.598 50.602 106.268 50.3911 107 50.3545C105.88 50.2903 104.936 49.8503 104.16 49.0069C103.384 48.1635 102.996 47.1642 102.996 46C102.996 47.1642 102.607 48.1635 101.831 49.0069Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div class="theme-switch__circle-container">
                <div class="theme-switch__sun-moon-container">
                  <div class="theme-switch__moon">
                    <div class="theme-switch__spot"></div>
                    <div class="theme-switch__spot"></div>
                    <div class="theme-switch__spot"></div>
                  </div>
                </div>
              </div>
            </div>
          </label>

          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <!-- 左侧 -->
            <div class="space-y-8">
              <div>
                <h1
                  :class="[
                    'text-4xl md:text-5xl font-bold mb-2 transition-colors',
                    isDark ? 'text-gray-200' : 'text-gray-800',
                  ]"
                >
                  欢迎回来!
                </h1>
                <p
                  :class="[
                    'text-lg transition-colors',
                    isDark ? 'text-blue-300' : 'text-blue-500',
                  ]"
                >
                  你发现了神秘的登录系统
                </p>
              </div>

              <!-- 输入框组件化 -->
              <div v-for="field in inputs" :key="field.key">
                <label
                  :for="field.key"
                  class="block text-sm mb-2 transition-colors"
                  :class="isDark ? 'text-gray-300' : 'text-gray-600'"
                >
                  {{ field.label }}
                </label>
                <input
                  :id="field.key"
                  v-model="field.model"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  autocomplete="off"
                  class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300"
                  :class="
                    isDark
                      ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400'
                      : 'bg-white/50 border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500'
                  "
                />
              </div>

              <div class="flex items-center text-sm justify-end">
                <a
                  href="#"
                  @click.prevent="showDialog = true"
                  :class="[
                    'transition-colors',
                    isDark
                      ? 'text-blue-300 hover:text-blue-200'
                      : 'text-blue-500 hover:text-blue-600',
                  ]"
                >
                  忘记密码?
                </a>
              </div>

              <!-- 按钮 -->
              <div>
                <button
                  @click="handleSubmit"
                  class="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl"
                  :class="
                    isDark
                      ? 'bg-gray-600 text-white hover:bg-gray-500'
                      : 'bg-foreground text-white hover:bg-gray-700'
                  "
                >
                  Sign In
                </button>
              </div>
            </div>

            <!-- 右侧插画 -->
            <div class="hidden lg:block relative">
              <div v-html="loginSvg"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <ModalDialog
      :dark="isDark"
      v-model="showDialog"
      title="还有高手"
      cancelText="手滑了"
      confirmText="嗯"
      :showConfirm="false"
    >
      <div :class="isDark ? 'text-white' : ''">点我没用，我也不知道怎么办</div>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import loginSvg from "../../../public/svg/bro.svg?raw";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/pinia";

const userStore = useUserStore();
const { $toast } = useNuxtApp();
const router = useRouter();
const account = ref("");
const password = ref("");
const showPassword = ref(false);
const isDark = ref(false);
const showDialog = ref(false);
const showContent = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  localStorage.setItem("darkMode", isDark.value ? "1" : "0");
};

const inputs = ref([
  {
    key: "account",
    label: "账号",
    type: "text",
    placeholder: "输入你的账号",
    model: account,
  },
  {
    key: "password",
    label: "密码",
    type: showPassword.value ? "text" : "password",
    placeholder: "•••••••",
    model: password,
  },
]);

const handleSubmit = async () => {
  console.log(account.value);
  if (!account.value || !password.value) {
    $toast?.warning("账号或密码为空！");
    return;
  }
  try {
    const res = await $request.Post("/auth/login", {
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

onMounted(() => {
  isDark.value = localStorage.getItem("darkMode") === "1";
  setTimeout(() => (showContent.value = true), 300);
});
</script>

<style src="@/assets/css/darkBtn.css"></style>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}
.animate-blob {
  animation: blob 15s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
.animation-delay-6000 {
  animation-delay: 6s;
}

.fly-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fly-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fly-up-enter-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>
