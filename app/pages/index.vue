<template>
  <div class="flex flex-col xl:flex-row w-full gap-4 min-w-0 bg">
    <div class="blur-bg"></div>
    <div class="page-container">
      <div class="firefly-container" ref="fireflyContainer" aria-hidden="true"></div>
      <!-- 左右两列容器 -->
      <div class="layout-container">
        <!-- 左侧 LeftPanel 容器，限制高度 -->
        <div class="left-wrapper">
          <LeftPanel :personalData="personalData" />
        </div>

        <!-- 右侧 RightPanel -->
        <RightPanel :personalData="personalData" />
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
        <ProjectTabs :projectsData="projectsData"></ProjectTabs>
      </div>
      <div class="font-heading text-6xl text-center m-16 text-[#007fff]">
        <Text3d class="font-bold max-md:text-7xl" shadow-color="red" :animate="false">
          ───随便拍拍───
        </Text3d>
      </div>
      <DraggableCards :photos="photos"></DraggableCards>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftPanel from "@/pages/home/LeftPanel.vue";
import RightPanel from "@/pages/home/RightPanel.vue";
import { onMounted } from "vue";

const fireflyContainer = ref<HTMLDivElement | null>(null);
const numFireflies = 20;
const projectsData = ref<any>(null);
const personalData = ref<any>(null);
const photos = ref([]);

function createFireflies() {
  if (!fireflyContainer.value) return;
  for (let i = 0; i < numFireflies; i++) {
    const firefly = document.createElement("div");
    firefly.classList.add("firefly");

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    firefly.style.transform = `translate3d(${startX}px, ${startY}px, 0)`;

    const delay = Math.random() * 3;
    firefly.style.animationDelay = `${delay}s, ${delay}s`;

    fireflyContainer.value.appendChild(firefly);
    animateFly(firefly, startX, startY);
  }
}

function clearFireflies() {
  fireflyContainer.value?.replaceChildren(); // 更快清除所有 firefly
}
function animateFly(el: HTMLElement, startX: number, startY: number) {
  const duration = 15000 + Math.random() * 25000;
  const deltaX = (Math.random() - 0.5) * 1600;
  const deltaY = (Math.random() - 0.5) * 1600;

  el.animate(
    [
      { transform: `translate3d(${startX}px, ${startY}px, 0)` },
      { transform: `translate3d(${startX + deltaX}px, ${startY + deltaY}px, 0)` },
      { transform: `translate3d(${startX}px, ${startY}px, 0)` },
    ],
    {
      duration,
      iterations: Infinity,
      direction: "alternate",
      easing: "ease-in-out",
    }
  );
}

onMounted(async () => {
  createFireflies();

  try {
    const res = await $request.Get("/home/get_projects");
    if (res.code === 200) {
      projectsData.value = res.data;
    } else {
      $toast?.error("获取失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }

  try {
    const res = await $request.Get("/home/get_personal");
    if (res.code === 200) {
      personalData.value = res.data;
    } else {
      $toast?.error("获取失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }

  try {
    const res = await $request.Get("/home/get_photos");
    if (res.code === 200) {
      photos.value = res.data;
    } else {
      $toast?.error("获取失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }
});
</script>

<style scoped>
.bg {
  background-image: url("../../public/img/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  /* backdrop-filter: blur(0px); */
}
.blur-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.15);
}
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
  top: 10rem;
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
@media (max-width: 700px) {
  .page-container {
    margin-left: 2rem;
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
