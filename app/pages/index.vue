<template>
  <div class="page-container">
    <!-- 左右两列容器 -->
    <div class="layout-container">
      <!-- 左侧 LeftPanel 容器，限制高度 -->
      <div class="left-wrapper">
        <LeftPanel />
      </div>

      <!-- 右侧 RightPanel -->
      <RightPanel />
    </div>

    <div class="mt-4">
      <div class="font-heading text-6xl text-center m-16 text-[#007fff]">
        <!-- <TextHighlight class="bg-gradient-to-r from-indigo-300 to-purple-300">
          我的一些作品
        </TextHighlight> -->
        <Text3d class="font-bold max-md:text-7xl" shadow-color="red" :animate="false">
          ───我的作品───
        </Text3d>
      </div>
      <ProjectTabs></ProjectTabs>
      <DraggableCards></DraggableCards>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftPanel from "@/pages/home/LeftPanel.vue";
import RightPanel from "@/pages/home/RightPanel.vue";
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 5rem;
  box-sizing: border-box;
}

/* 布局：左右两列 */
.layout-container {
  display: flex;
  gap: 2rem;
}

/* 左侧容器：限制高度等于右侧内容高度 */
.left-wrapper {
  flex: 0 0 500px; /* 固定宽度 */
  position: relative;
}

/* LeftPanel sticky */
.left-wrapper > * {
  position: sticky;
  top: 5rem;
  align-self: flex-start;
}

/* 右侧占满剩余空间 */
.layout-container > :last-child {
  flex: 1 1 0; /* 允许缩小 */
  min-width: 0; /* 关键，防止内容撑开 */
}

/* 响应式，小屏幕堆叠 */
@media (max-width: 1400px) {
  .layout-container {
    flex-direction: column;
    gap: 1.5rem;
    padding-top: 3rem;
  }

  .left-wrapper {
    flex: 1 1 100%;
  }

  .left-wrapper > * {
    position: relative;
    top: 0;
  }
}

/* 作品集 */
.portfolio-section {
  height: 100vh; /* 示例高度，可调整 */
  background: #f0f0f0;
  padding: 4rem;
  margin: 2rem 0;
  font-size: 2rem;
  text-align: center;
  color: #555;
}
</style>
