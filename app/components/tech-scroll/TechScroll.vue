<template>
  <div class="container">
    <div class="tech-scroll-container" @mouseenter="onEnter" @mouseleave="onLeave">
      <div class="scroll-wrapper" ref="wrapper">
        <!-- row1 -->
        <div class="scroll-row row-1" ref="row1" :class="{ hidden: showTags }">
          <div
            v-for="(tech, index) in frontendItemsExtended"
            :key="'row1-' + index"
            class="tech-item"
            :style="{ '--enter-delay': index * 0.05 + 's' }"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <!-- row2 -->
        <div class="scroll-row row-2" ref="row2" :class="{ hidden: showTags }">
          <div
            v-for="(tech, index) in backendItemsExtended"
            :key="'row2-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <!-- row3 -->
        <div class="scroll-row row-3" ref="row3" :class="{ hidden: showTags }">
          <div
            v-for="(tech, index) in toolsItemsExtended"
            :key="'row3-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <!-- tags -->
        <transition name="fade">
          <div class="tags-container" v-if="showTags">
            <div
              v-for="(tech, index) in allTechItems"
              :key="'tag-' + index"
              class="tag-item"
            >
              <img :src="tech.icon" alt="" />
              <span>{{ tech.name }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

interface Tech {
  name: string;
  icon: string;
}

const row1 = ref<HTMLElement | null>(null);
const row2 = ref<HTMLElement | null>(null);
const row3 = ref<HTMLElement | null>(null);
const wrapper = ref<HTMLElement | null>(null);
const showTags = ref(false);

// 技术栈
const frontendItems: Tech[] = [
  {
    name: "TypeScript",
    icon:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "Sass",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
  },
];
const backendItems: Tech[] = [
  {
    name: "C#",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
  },
  {
    name: ".NET",
    icon:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg",
  },
  {
    name: "Redis",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  {
    name: "Vue.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  {
    name: "JavaScript",
    icon:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
];
const toolsItems: Tech[] = [
  {
    name: "Git",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "VS Code",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
];

const allTechItems = [...frontendItems, ...backendItems, ...toolsItems];

// 扩展数组，保证滚动行长度 >= 容器宽度
const frontendItemsExtended = [...frontendItems, ...frontendItems];
const backendItemsExtended = [...backendItems, ...backendItems];
const toolsItemsExtended = [...toolsItems, ...toolsItems];

// 悬浮
const onEnter = () => {
  showTags.value = true;
};
const onLeave = () => {
  showTags.value = false;
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(180deg, #fefde8 0%, #cbc6c6 100%);
  max-width: none !important;
}

.tech-scroll-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.scroll-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
}

/* 滚动行 */
.scroll-row {
  display: flex;
  width: max-content;
  margin: 10px 0;
}
.scroll-row.hidden {
  opacity: 0;
}

/* CSS 动画滚动 */
.row-1 {
  animation: scroll-left 25s linear infinite;
}
.row-2 {
  animation: scroll-right 30s linear infinite;
}
.row-3 {
  animation: scroll-left 35s linear infinite;
}

@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
@keyframes scroll-right {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

/* 技术图标 */
.tech-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin: 0 8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: enter-animation 0.8s forwards;
}
.tech-item img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}
.tech-item:hover {
  transform: translateY(-4px) scale(1.05);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

@keyframes enter-animation {
  0% {
    transform: translateY(15px) rotate(-10deg) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(-3px) rotate(5deg) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
}

/* tags */
.tags-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  padding: 8px 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.05);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 4px 8px;
  font-size: 0.7rem;
  color: #333;
  transition: all 0.2s ease;
  cursor: pointer;
}
.tag-item img {
  width: 16px;
  height: 16px;
}
.tag-item:hover {
  transform: translateY(-1px);
  background: #f0f0f0;
}

/* fade 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ----------------- H5 ----------------- */
@media (max-width: 768px) {
  .scroll-wrapper {
    height: 180px;
  }
  .tech-item {
    width: 50px;
    height: 50px;
    margin: 0 6px;
  }
  .tech-item img {
    width: 32px;
    height: 32px;
  }
  .tags-container {
    gap: 4px;
    padding: 6px 0;
  }
  .tag-item {
    font-size: 0.65rem;
    padding: 3px 6px;
  }
}
</style>
