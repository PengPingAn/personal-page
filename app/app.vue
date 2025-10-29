<script setup lang="ts">
import HomePage from "./pages/index.vue";
</script>

<template>
  <!-- 模糊层 -->
  <div class="blur-bg"></div>

  <!-- 主页面内容 -->
  <HomePage />
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  font-family: "Noto Serif SC", serif;
  /* font-family: "Caveat", cursive; */
}

/* 背景渐变和图像保持 */
body {
  background: linear-gradient(to bottom left, rgb(255, 255, 255) 50%, black 50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-image: url("../public/img/bg.png");
  overflow-x: hidden;
}

/* ✅ 模糊层（固定在整个视口） */
.blur-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.15); /* 增加玻璃质感 */
}

/* 页面内容在模糊层上方 */
#app,
body > *:not(.blur-bg) {
  position: relative;
  z-index: 1;
}

/* 你的动画保留 */
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
