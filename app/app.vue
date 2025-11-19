<script setup lang="ts">
import Toast from "./components/Toast.vue";
</script>

<template>
  <div class="page-container flex flex-col w-full min-h-screen gap-4">
    <!-- 模糊层 -->
    <!-- <div class="blur-bg"></div> -->
    <!-- <div class="firefly-container" ref="fireflyContainer" aria-hidden="true"></div> -->

    <!-- <div class="flex flex-col xl:flex-row w-full gap-4 min-w-0"> -->
    <!-- 主页面内容 -->
    <NuxtPage />
    <Toast />
    <!-- </div> -->
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
  /* background: linear-gradient(to bottom left, rgb(255, 255, 255) 50%, black 50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: url("../public/img/bg.png");*/
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

.firefly-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 998;
  background: transparent;
  overflow: hidden;
}

.firefly {
  position: absolute;
  width: 3px;
  height: 3px;
  background: radial-gradient(circle, #f3f3ef 0%, #dfdddd 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 10px 1px #ffaa00;
  opacity: 0;
  animation: fadeIn 0.07s ease-out forwards, blink 2.5s infinite ease-in-out;
  will-change: transform, opacity;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.8;
  }
}

@keyframes blink {
  0%,
  100% {
    transform: scale(0.9);
  }
  50% {
    transform: scale(1.3);
  }
}
</style>
