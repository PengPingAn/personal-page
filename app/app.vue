<script setup lang="ts">
import HomePage from "./pages/index.vue";
</script>

<template>
  <div class="page-container flex flex-col w-full min-h-screen gap-4 p-4 md:p-8">
    <!-- 模糊层 -->
    <div class="blur-bg"></div>

    <div class="flex flex-col xl:flex-row w-full gap-4 min-w-0">
      <!-- 主页面内容 -->
      <HomePage />
    </div>
  </div>
</template>

<style>
html,
body {
  margin: 0;
  min-height: 100vh;
  width: 100%;
  min-width: 100vw;
  font-family: "Noto Serif SC", serif;
}

/* 背景 */
body {
  background: linear-gradient(to bottom left, rgb(255, 255, 255) 50%, black 50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: url("../public/img/bg.png");
  overflow-x: hidden;
}

/* 模糊层 */
.blur-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.15);
}

/* 内容层 */
body > *:not(.blur-bg) {
  position: relative;
  z-index: 1;
  width: 100%; /* ✅ 解决 H5 只占左边问题 */
}

/* 动画保留 */
@keyframes hand {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}
</style>
