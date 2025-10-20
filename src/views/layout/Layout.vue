<template>
  <div class="layout-container">
    <LeftPanel />
    <RightPanel />
  </div>
</template>

<script setup lang="ts">
import LeftPanel from "@/views/home/LeftPanel.vue";
import RightPanel from "@/views/home/RightPanel.vue";
import { ref } from "vue";
</script>

<style scoped>
.layout-container {
  display: flex;
  gap: 2rem;
  max-width: 1400px; /* 最大宽度 */
  margin: 0 auto;
  padding: 2rem;
  padding-top: 5rem;
  width: 100%;
  box-sizing: border-box;
}

/* 左侧固定宽度并在滚动时保持可视 */
.layout-container > :first-child {
  flex: 0 0 500px; /* 固定宽度 */
  position: sticky;
  top: 5rem; /* 距离视口顶部的偏移，可根据实际调整 */
  align-self: flex-start; /* 保持在顶部对齐 */
}

/* 右边自适应剩余空间 */
.layout-container > :last-child {
  flex: 1 1 auto; /* 占满剩余空间 */
  overflow-x: auto; /* 内容可横向滚动 */
}

/* 响应式，小屏幕下堆叠 */
@media (max-width: 1100px) {
  .layout-container {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
    padding-top: 3rem;
  }
  .layout-container > :first-child,
  .layout-container > :last-child {
    flex: 1 1 100%;
    min-width: 0;
    position: relative;
    top: 0rem;
  }
}
</style>
