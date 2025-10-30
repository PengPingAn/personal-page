<template>
  <div class="left-panel">
    <!-- 头像 -->
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

    <!-- 文字区域 -->
    <div
      class="text-white font-bold flex flex-col gap-4 opacity-0 transform translate-y-10"
      ref="textRef"
    >
      <div class="text-3xl flex items-center gap-2">
        <span class="inline-block animate-[hand_2s_ease-in-out_infinite]">👋</span>
        <span>你好，我是</span>
      </div>

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

      <!-- 按钮 -->
      <div class="flex items-center gap-4 flex-wrap">
        <div
          v-for="(btn, index) in buttons"
          :key="index"
          class="hover-button inline-flex items-center gap-2 rounded-[2rem] p-2 px-4 bg-[#cbebf9d4] fly-in-left"
          @mousemove="handleMouseMove($event, index)"
          @mouseleave="handleMouseLeave(index)"
          ref="buttonRefs"
          :style="buttonStyles[index]"
        >
          <span :class="btn.icon"></span>{{ btn.label }}
        </div>
      </div>

      <TooltipSlot class="flex-none">
        <template #trigger>
          <div class="flex items-center gap-4 flex-wrap">
            <div
              class="inline-flex items-center gap-2 px-4 py-2 bg-white/30 backdrop-blur-md shadow-md rounded-[2rem] relative cursor-pointer"
            >
              <span class="line-md--coffee-loop"></span>
              请作者喝咖啡
            </div>
          </div>
        </template>
        <template #content>
          <div class="">
            <div class="flex gap-4">
              <img
                :src="imgUlrs[0]"
                alt="悬浮图片"
                class="w-48 h-48 mb-2"
                style="border-radius: 0.5rem"
              />
              <img
                :src="imgUlrs[1]"
                alt="悬浮图片"
                class="w-48 h-48 mb-2"
                style="border-radius: 0.5rem"
              />
            </div>
            <div
              class="flex items-center justify-center text-gray-500 text-sm font-medium gap-2"
            >
              <span class="text-gray-400">——</span>
              <span>谢谢你的支持！</span>
              <span class="text-gray-400">——</span>
            </div>
          </div>
        </template>
      </TooltipSlot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from "vue";

const imgUlrs = ref([
  "https://img1.fjdaily.com/app/images/2024-05/20/7f9815fd-3570-46ab-ba84-8ed3eee95810.jpg",
  "https://img2.baidu.com/it/u=2664851014,2738471250&fm=253&fmt=auto&app=138&f=PNG?w=500&h=680",
]);
const texts = ["创造者", "全栈开发者", "设计者"];
const currentIndex = ref(0);
const currentText = computed(() => texts[currentIndex.value]);
let interval: number;

const avatarRef = ref<HTMLElement>();
const textRef = ref<HTMLElement>();
const buttonRefs = ref<HTMLElement[]>([]);
const coffeeBtnRef = ref<HTMLElement | null>(null);

const cardStyle = reactive({ left: "0px", top: "0px" });

onMounted(() => {
  interval = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.length;
  }, 3000);

  nextTick(() => {
    animateIn(avatarRef.value!, 0);
    animateIn(textRef.value!, 200);
    buttonRefs.value.forEach((el, i) => {
      animateIn(el, 600 + i * 150);
      el.style.setProperty("--i", i.toString());
    });
  });

  initBubble();
});

onBeforeUnmount(() => {
  clearInterval(interval);
  window.removeEventListener("scroll", updateCardPosition);
  window.removeEventListener("resize", updateCardPosition);
});

function animateIn(el: HTMLElement, delay = 0) {
  el.style.transition = "all 0.8s cubic-bezier(0.22,1,0.36,1)";
  setTimeout(() => {
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  }, delay);
}

// ----------------- 按钮悬浮效果 -----------------
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

// ----------------- 咖啡悬浮卡片 -----------------
const updateCardPosition = () => {
  if (!coffeeBtnRef.value) return;
  const rect = coffeeBtnRef.value.getBoundingClientRect();
  cardStyle.left = rect.left + rect.width / 2 + "px";
  cardStyle.top = rect.bottom + window.scrollY + 8 + "px";
  cardStyle.transform = "translateX(-50%)";
};

// ---------------- 水泡 ----------------
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
    requestAnimationFrame(animate);
  };
  animate();
}
</script>

<style src="@/assets/css/icon.css"></style>
<style scoped>
.left-panel {
  flex: 0 0 40%;
  position: sticky;
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 按钮动画 */
.hover-button {
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
}
.fly-in-left {
  opacity: 0;
  margin-left: -50px;
  animation: fly-in-left-anim 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: calc(var(--i, 0) * 0.15s);
}
@keyframes fly-in-left-anim {
  0% {
    opacity: 0;
    margin-left: -50px;
  }
  100% {
    opacity: 1;
    margin-left: 0;
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
  transition: all 0.3s ease;
}

/* 响应式小屏可滚动 */
@media (max-width: 1400px) {
  .left-panel {
    position: relative;
    top: auto;
    width: 100%;
    margin-top: 2rem;
  }
}
@media (max-width: 768px) {
  .text-2xl.flex.items-center.h-8.overflow-hidden.relative {
    width: 110%;
  }
}
</style>
