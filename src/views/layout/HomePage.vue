<template>
  <div class="layout-container">
    <!-- 左侧 30% -->
    <div class="left-panel">
      <!-- 头像容器 -->
      <div class="relative w-32 h-32 opacity-0 transform translate-y-10" ref="avatarRef">
        <svg viewBox="0 0 100 100" class="absolute inset-0 w-full h-full z-20">
          <defs>
            <filter id="bubbleWarp">
              <feTurbulence
                id="turbulence"
                type="fractalNoise"
                baseFrequency="0.02 0.03"
                numOctaves="3"
                seed="8"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="8s"
                  values="0.02 0.03;0.03 0.02;0.018 0.025;0.02 0.03"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="15" />
            </filter>
            <clipPath id="bubbleClip">
              <circle cx="50" cy="50" r="48" />
            </clipPath>
          </defs>

          <image
            href="https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1760522936_bb6d63b9.jpg"
            width="100"
            height="100"
            clip-path="url(#bubbleClip)"
            filter="url(#bubbleWarp)"
            preserveAspectRatio="xMidYMid slice"
          />

          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            stroke-width="1.5"
          />
        </svg>
      </div>

      <!-- 左侧文字 -->
      <div
        class="text-white font-bold flex flex-col gap-4 opacity-0 transform translate-y-10"
        ref="textRef"
      >
        <div class="text-3xl">你好，我是<br /></div>
        <div style="font-size: 40px">
          开发者，
          <ResizableDashedLabel
            text=" <平安/>"
            :enabled="true"
            :resizable="false"
            bgColor="rgba(0,128,255,0.08)"
            borderColor="#87a661"
            :initialFontSize="40"
            :width="220"
            :height="70"
            textColor="#25ebb0"
          />
        </div>

        <div class="text-2xl flex items-center h-8 overflow-hidden relative">
          <span>一位热爱生活的 </span>
          <div class="relative w-[160px] h-8 overflow-hidden ml-2">
            <transition name="scroll-text" mode="out-in">
              <span
                :key="currentText"
                class="absolute left-0 top-0 w-full truncate"
                style="color: #87a661"
              >
                {{ currentText }}
              </span>
            </transition>
          </div>
        </div>

        <div>
          我是一名全栈开发者，喜欢用代码和设计搭建小而美的产品。
          <br />
          对新技术充满好奇，也常在探索中学习，希望能和大家一起进步。
        </div>

        <div class="flex items-center gap-4 flex-wrap">
          <div
            v-for="(btn, index) in buttons"
            :key="index"
            class="hover-button inline-flex items-center gap-2 rounded-[2rem] p-2 px-4 bg-[#cbebf9d4] fly-in-btn"
            @mousemove="handleMouseMove($event, index)"
            @mouseleave="handleMouseLeave(index)"
            ref="buttonRefs"
            :style="buttonStyles[index]"
          >
            <span :class="btn.icon"></span>{{ btn.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧 70% -->
    <div class="right-panel">
      <div class="text-3xl font-semibold text-white" ref="rightRef">
        <div v-for="item in 50" :key="item">你好</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick, computed } from "vue";

// 滚动文字
const texts = ["创造者", "全栈开发者", "设计者"];
const currentIndex = ref(0);
const currentText = computed(() => texts[currentIndex.value]);
let interval: number;

onMounted(() => {
  interval = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.length;
  }, 3000);

  // 飞入动画
  nextTick(() => {
    animateIn(avatarRef.value!, 0);
    animateIn(textRef.value!, 200);
    animateIn(rightRef.value!, 400);
    buttonRefs.value.forEach((el, i) => {
      animateIn(el, 600 + i * 150);
      el.style.setProperty("--i", i.toString());
    });
  });

  // 初始化水泡
  initBubble();
});
onBeforeUnmount(() => clearInterval(interval));

const avatarRef = ref<HTMLElement>();
const textRef = ref<HTMLElement>();
const rightRef = ref<HTMLElement>();
const buttonRefs = ref<HTMLElement[]>([]);

function animateIn(el: HTMLElement, delay = 0) {
  el.style.transition = "all 0.8s cubic-bezier(0.22,1,0.36,1)";
  setTimeout(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, delay);
}

// 按钮
const buttons = [
  { label: "Gitee", icon: "simple-icons--gitee" },
  { label: "Email", icon: "streamline-ultimate-color--send-email-envelope" },
  { label: "Blog", icon: "la--blog" },
];
const buttonStyles = reactive(
  buttons.map(() => ({
    transform: "translate(0,0)",
    transition: "transform 0.2s cubic-bezier(0.22,1,0.36,1)",
  }))
);
const handleMouseMove = (e: MouseEvent, index: number) => {
  const el = e.currentTarget as HTMLElement;
  const rect = el.getBoundingClientRect();
  const offsetX = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 15;
  const offsetY = ((e.clientY - rect.top - rect.height / 2) / rect.height) * 15;
  buttonStyles[index].transform = `translate(${offsetX}px, ${offsetY}px)`;
};
const handleMouseLeave = (index: number) => {
  buttonStyles[index].transition = "transform 0.5s cubic-bezier(0.22,1,0.36,1)";
  buttonStyles[index].transform = `translate(0,0)`;
};

// ---------------- 水泡逻辑 ----------------
const bubblePath = ref("");
const points = ref(
  Array.from({ length: 16 }).map((_, i) => ({
    baseX: 50 + 40 * Math.cos((Math.PI * 2 * i) / 16),
    baseY: 50 + 40 * Math.sin((Math.PI * 2 * i) / 16),
    offsetX: 0,
    offsetY: 0,
    targetX: Math.random() * 8 - 4,
    targetY: Math.random() * 8 - 4,
    speed: 0.01 + Math.random() * 0.015,
  }))
);

function initBubble() {
  const animate = () => {
    points.value.forEach((p) => {
      p.offsetX += (p.targetX - p.offsetX) * p.speed;
      p.offsetY += (p.targetY - p.offsetY) * p.speed;
      if (Math.random() < 0.01) {
        p.targetX = Math.random() * 8 - 4;
        p.targetY = Math.random() * 8 - 4;
      }
    });
    let d = `M ${points.value[0].baseX + points.value[0].offsetX},${
      points.value[0].baseY + points.value[0].offsetY
    }`;
    for (let i = 0; i < points.value.length; i++) {
      const next = points.value[(i + 1) % points.value.length];
      const cx =
        (points.value[i].baseX + next.baseX + points.value[i].offsetX + next.offsetX) / 2;
      const cy =
        (points.value[i].baseY + next.baseY + points.value[i].offsetY + next.offsetY) / 2;
      d += ` Q ${points.value[i].baseX + points.value[i].offsetX},${
        points.value[i].baseY + points.value[i].offsetY
      } ${cx},${cy}`;
    }
    d += " Z";
    bubblePath.value = d;
    requestAnimationFrame(animate);
  };
  animate();
}
</script>

<style src="@/css/icon.css"></style>
<style scoped>
/* 布局 */
.layout-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  gap: 2rem;
  padding: 2rem;
}
.left-panel {
  flex: 0 0 40%;
  position: sticky;
  top: 5rem;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.right-panel {
  flex: 1;
}

/* 响应式：小屏不固定 */
@media (max-width: 1100px) {
  .layout-container {
    flex-direction: column;
  }
  .left-panel {
    position: relative;
    top: auto;
    width: 100%;
    padding-left: 0;
    margin-top: 2rem;
  }
}

/* 按钮动画 */
.hover-button {
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
}
.fly-in-btn {
  opacity: 0;
  animation: fly-in-opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i) * 0.15s);
}
@keyframes fly-in-opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* 滚动文字 */
.scroll-text-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.scroll-text-enter-to {
  transform: translateY(0);
  opacity: 1;
}
.scroll-text-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.scroll-text-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
.scroll-text-enter-active,
.scroll-text-leave-active {
  transition: all 0.5s ease;
}
</style>
