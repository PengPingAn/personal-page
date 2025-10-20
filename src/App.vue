<script setup lang="ts">
import HomePage from "./views/layout/Layout.vue";
</script>

<template>
  <HomePage />
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
}

body {
  background: linear-gradient(to bottom left, rgb(255, 255, 255) 50%, black 50%);
  background-repeat: no-repeat;
  background-size: cover; /* 让背景自适应容器 */
  background-attachment: fixed;
  font-family: "Noto Serif SC", serif;
}

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
