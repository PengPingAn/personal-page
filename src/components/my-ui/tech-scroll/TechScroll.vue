<template>
  <div class="container">
    <div class="tech-scroll-container" @mouseenter="onEnter" @mouseleave="onLeave">
      <div class="scroll-wrapper" ref="wrapper">
        <div class="scroll-row row-1" ref="row1" v-show="!showTags">
          <div
            v-for="(tech, index) in frontendItems"
            :key="'row1-' + index"
            class="tech-item"
            :style="{ '--enter-delay': index * 0.05 + 's' }"
          >
            <img :src="tech.icon" alt="" />
          </div>
          <div
            v-for="(tech, index) in frontendItems"
            :key="'row1-copy-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <div class="scroll-row row-2" ref="row2" v-show="!showTags">
          <div
            v-for="(tech, index) in backendItems"
            :key="'row2-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
          <div
            v-for="(tech, index) in backendItems"
            :key="'row2-copy-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <div class="scroll-row row-3" ref="row3" v-show="!showTags">
          <div
            v-for="(tech, index) in toolsItems"
            :key="'row3-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
          <div
            v-for="(tech, index) in toolsItems"
            :key="'row3-copy-' + index"
            class="tech-item"
          >
            <img :src="tech.icon" alt="" />
          </div>
        </div>

        <!-- tags 区 -->
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
import { ref, nextTick, onMounted } from "vue";

interface Tech {
  name: string;
  icon: string;
  level?: string;
}

// refs
const row1 = ref<HTMLElement | null>(null);
const row2 = ref<HTMLElement | null>(null);
const row3 = ref<HTMLElement | null>(null);
const wrapper = ref<HTMLElement | null>(null);

// 控制 tags 显示
const showTags = ref(false);

// 技术栈数据（原来的）
const techStack = {
  frontend: [
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
  ],
  backend: [
    {
      name: "C#",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg",
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
  ],
  tools: [
    {
      name: "Git",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    },
    {
      name: "Docker",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    },
    {
      name: "MySQL",
      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    },
    {
      name: "VS Code",
      icon:
        "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
    },
  ],
};

const frontendItems = techStack.frontend;
const backendItems = techStack.backend;
const toolsItems = techStack.tools;
const allTechItems = [...frontendItems, ...backendItems, ...toolsItems];

// 悬浮事件
const onEnter = () => {
  showTags.value = true;
  pauseAnimation();
};
const onLeave = () => {
  showTags.value = false;
  resumeAnimation();
};

// 暂停/继续滚动动画
const pauseAnimation = () => {
  [row1, row2, row3].forEach((r) => {
    if (r.value) r.value.style.animationPlayState = "paused";
  });
};
const resumeAnimation = () => {
  [row1, row2, row3].forEach((r) => {
    if (r.value) r.value.style.animationPlayState = "running";
  });
};

// 自动计算 wrapper 高度防抖动
const updateWrapperHeight = () => {
  nextTick(() => {
    if (!wrapper.value) return;
    let maxHeight = 0;
    [row1, row2, row3].forEach((r) => {
      if (r.value && r.value.offsetHeight > maxHeight) maxHeight = r.value.offsetHeight;
    });
    // wrapper.value.style.height = maxHeight + "px";
  });
};

onMounted(() => {
  resumeAnimation();
  updateWrapperHeight();
  window.addEventListener("resize", updateWrapperHeight);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  text-align: center;
  max-width: 380px;
  background-image: linear-gradient(180deg, #fefde8 0%, #cbc6c6 100%);
  /* 引入斑驳纹理图像，并设置重复方式和透明度 */

  background-repeat: repeat;
  background-position: center center;
  background-size: auto, cover;
  /* opacity: 0.04; */
  inset: 0;
  border-radius: 1rem;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  color: #b8c1ec;
  margin-bottom: 40px;
  font-size: 1.1rem;
}

.tech-scroll-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scroll-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 270px;
}

.scroll-row {
  display: flex;
  width: max-content;
  margin: 15px 0;
}

.row-1 {
  animation: scroll-left 25s linear infinite;
}
.row-2 {
  animation: scroll-right 30s linear infinite;
}
.row-3 {
  animation: scroll-left 35s linear infinite;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 70px;
  margin: 0 12px;
  background: rgb(255, 255, 255);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);

  animation: enter-animation 0.8s forwards;
  animation-delay: var(--enter-delay, 0s);
}

img {
  border-radius: 15px;
  padding: 3px;
}

.tech-item:hover {
  transform: translateY(-5px) scale(1.05);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.3);
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
@keyframes enter-animation {
  0% {
    transform: translateY(20px) rotate(-10deg) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px) rotate(5deg) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

/* fade 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* tags */
.tags-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 10px 0;
  animation: enter-animation 0.8s forwards;
  animation-delay: var(--enter-delay, 0s);
}

@keyframes enter-animation {
  0% {
    transform: translateY(20px) rotate(-10deg) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px) rotate(5deg) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 0.8rem;
  color: #333;
  transition: all 0.2s ease;
  cursor: pointer;
}
.tag-item img {
  width: 18px;
  height: 18px;
}
.tag-item:hover {
  transform: translateY(-2px);
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .tech-item {
    width: 120px;
    height: 100px;
    margin: 0 8px;
  }
  .row-label {
    display: none;
  }
}
</style>
