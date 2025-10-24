<template>
  <div class="pointer-highlight-container" :class="containerClassName" ref="containerRef">
    <!-- 内容区域，确保文字在上层 -->
    <div class="content-wrapper relative z-10">
      <slot></slot>
    </div>

    <!-- 动画背景，确保在底层 -->
    <div
      v-if="dimensions.width > 0 && dimensions.height > 0 && isInViewport"
      class="pointer-highlight-overlay"
      :class="{ animate: isInViewport }"
    >
      <div
        class="pointer-highlight-rectangle"
        :class="rectangleClassName"
        :style="{
          '--target-width': dimensions.width + 'px',
          '--target-height': dimensions.height + 'px',
        }"
      ></div>
      <div
        class="pointer-highlight-pointer"
        :style="{
          '--target-x': dimensions.width + 4 + 'px',
          '--target-y': dimensions.height + 4 + 'px',
        }"
      >
        <svg
          class="pointer-icon"
          :class="pointerClassName"
          stroke="currentColor"
          fill="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// Props
const props = defineProps({
  rectangleClassName: {
    type: String,
    default: "",
  },
  pointerClassName: {
    type: String,
    default: "",
  },
  containerClassName: {
    type: String,
    default: "",
  },
  // 添加视口检测配置
  intersectionOptions: {
    type: Object,
    default: () => ({
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }),
  },
});

// Refs
const containerRef = ref(null);
const dimensions = ref({ width: 0, height: 0 });
const isInViewport = ref(false);
let resizeObserver = null;
let intersectionObserver = null;

// Methods
const updateDimensions = () => {
  if (containerRef.value) {
    const { width, height } = containerRef.value.getBoundingClientRect();
    dimensions.value = { width, height };
  }
};

// 处理视口交集变化
const handleIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isInViewport.value = true;
    } else {
      // 当元素离开视口时重置状态，以便下次进入时重新触发动画
      isInViewport.value = false;
    }
  });
};

// Lifecycle
onMounted(() => {
  updateDimensions();

  // 设置 ResizeObserver 监听尺寸变化
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      dimensions.value = { width, height };
    }
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);

    // 设置 IntersectionObserver 监听视口交集
    intersectionObserver = new IntersectionObserver(
      handleIntersection,
      props.intersectionOptions
    );
    intersectionObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }

  if (intersectionObserver && containerRef.value) {
    intersectionObserver.unobserve(containerRef.value);
  }
});
</script>

<style scoped>
.pointer-highlight-container {
  position: relative;
  width: fit-content;
  display: inline-block;
}

/* 确保内容在上层 */
.content-wrapper {
  position: relative;
  z-index: 10;
}

/* 确保动画背景在底层 */
.pointer-highlight-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1; /* 比内容低，但比普通内容高 */
  opacity: 0;
  transform: scale(0.95);
  transform-origin: 0 0;
}

.pointer-highlight-overlay.animate {
  animation: fadeInScale 0.5s ease-out forwards;
}

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.pointer-highlight-rectangle {
  position: absolute;
  inset: 0;
  border: 1px solid #262626;
  /* 移除背景色，使用半透明效果 */
  background-color: rgba(229, 229, 229, 0.3);
  width: 0;
  height: 0;
}

.pointer-highlight-overlay.animate .pointer-highlight-rectangle {
  animation: expandRectangle 1s ease-in-out forwards;
}

:global(.dark) .pointer-highlight-rectangle {
  border-color: #e5e5e5;
  background-color: rgba(64, 64, 64, 0.3); /* 深色模式下的半透明背景 */
}

@keyframes expandRectangle {
  to {
    width: var(--target-width);
    height: var(--target-height);
  }
}

.pointer-highlight-pointer {
  pointer-events: none;
  position: absolute;
  opacity: 0;
  transform: rotate(-90deg);
}

.pointer-highlight-overlay.animate .pointer-highlight-pointer {
  animation: movePointer 1s ease-in-out forwards;
}

@keyframes movePointer {
  0% {
    opacity: 0;
    left: 0;
    top: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    left: var(--target-x);
    top: var(--target-y);
  }
}

.pointer-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #eab308;
}
</style>
