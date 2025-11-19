<template>
  <div class="floating-card-wrapper">
    <!-- 触发元素插槽 -->
    <span
      ref="triggerRef"
      @mouseenter="showCard"
      @mouseleave="hideCard"
      class="trigger-element"
    >
      <slot name="trigger">悬停显示</slot>
    </span>

    <!-- 悬浮卡片 -->
    <Teleport to="body">
      <Transition name="fly" @enter="onEnter" @leave="onLeave">
        <div
          v-if="visible"
          ref="cardRef"
          :style="cardStyle"
          class="floating-card"
          @mouseenter="showCard"
          @mouseleave="hideCard"
        >
          <div class="card-content-container">
            <div
              class="card-content-wrapper"
              ref="contentWrapperRef"
              @scroll="handleScroll"
            >
              <slot>
                <div class="card-content"></div>
              </slot>
            </div>

            <!-- 固定在底部的阴影 -->
            <div
              v-if="showShadow && !isAtBottom"
              class="fixed-bottom-shadow"
              :style="{ opacity: shadowOpacity }"
            ></div>
          </div>
          <!-- <div
            v-if="showShadow && !isAtBottom"
            class="fixed-bottom-shadow"
            :style="{ opacity: shadowOpacity }"
          ></div> -->
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  offset: { type: Number, default: 12 },
  delay: { type: Number, default: 50 },
});

const visible = ref(false);
const triggerRef = ref(null);
const cardRef = ref(null);
const position = ref({ top: 0, left: 0 });
const placement = ref("bottom");
const contentWrapperRef = ref(null);

// 阴影相关状态
const showShadow = ref(false);
const isAtBottom = ref(false);
const shadowOpacity = ref(1);

let timer = null;

const cardStyle = computed(() => ({
  position: "fixed",
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  zIndex: 9999,
  transformOrigin: placement.value === "top" ? "bottom center" : "top center",
}));

const calculatePosition = async () => {
  if (!triggerRef.value) return;
  await nextTick();

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const cardWidth = cardRef.value?.offsetWidth || 300;
  const cardHeight = cardRef.value?.offsetHeight || 100;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollbarWidth = 20;

  let top = triggerRect.bottom + props.offset;
  let left = triggerRect.left + triggerRect.width / 2 - cardWidth / 2;
  let finalPlacement = "bottom";

  if (left + cardWidth > viewportWidth - scrollbarWidth)
    left = viewportWidth - cardWidth - scrollbarWidth - 8;
  if (left < 8) left = 8;
  if (top + cardHeight > viewportHeight - 8) {
    top = triggerRect.top - cardHeight - props.offset;
    finalPlacement = "top";
    if (top < 8) {
      top = triggerRect.top + triggerRect.height / 2 - cardHeight / 2;
      left = triggerRect.right + props.offset;
      finalPlacement = "right";
      if (left + cardWidth > viewportWidth - scrollbarWidth) {
        left = triggerRect.left - cardWidth - props.offset;
        finalPlacement = "left";
      }
    }
  }
  if (top < 8) top = 8;
  if (top + cardHeight > viewportHeight - 8) top = viewportHeight - cardHeight - 8;

  position.value = { top, left };
  placement.value = finalPlacement;
};

const showCard = () => {
  clearTimeout(timer);
  timer = setTimeout(async () => {
    visible.value = true;
    await nextTick();
    calculatePosition();
  }, props.delay);
};

const hideCard = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    visible.value = false;
  }, props.delay);
};

const onEnter = (el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
  requestAnimationFrame(() => {
    el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.opacity = "1";
    el.style.transform = "translateY(0)";
  });
};

const onLeave = (el) => {
  el.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  el.style.opacity = "0";
  el.style.transform = "translateY(20px)";
};

// 处理滚动
const handleScroll = () => {
  updateShadowState();
};

// 更新阴影状态
const updateShadowState = () => {
  if (!contentWrapperRef.value) return;

  const el = contentWrapperRef.value;
  const { scrollTop, scrollHeight, clientHeight } = el;

  // 检查是否有溢出内容
  const hasOverflow = scrollHeight > clientHeight;
  showShadow.value = hasOverflow;

  if (hasOverflow) {
    // 检查是否滚动到底部（允许1px的误差）
    const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;
    isAtBottom.value = atBottom;

    // 计算接近底部时的阴影透明度（在最后20px范围内逐渐消失）
    const distanceFromBottom = scrollHeight - clientHeight - scrollTop;
    const fadeThreshold = 20; // 开始淡出的距离阈值

    if (distanceFromBottom <= fadeThreshold) {
      shadowOpacity.value = distanceFromBottom / fadeThreshold;
    } else {
      shadowOpacity.value = 1;
    }
  } else {
    isAtBottom.value = true;
    shadowOpacity.value = 0;
  }
};

// 初始化阴影状态
const initShadow = () => {
  if (contentWrapperRef.value) {
    updateShadowState();
  }
};

// 添加滚动和窗口大小变化的监听
const handleScrollAndResize = () => {
  if (visible.value) {
    calculatePosition();
    nextTick(updateShadowState);
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScrollAndResize, true);
  window.addEventListener("resize", handleScrollAndResize);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScrollAndResize, true);
  window.removeEventListener("resize", handleScrollAndResize);
});

watch(visible, async (val) => {
  if (val) {
    await nextTick();
    initShadow();
  }
});
</script>

<style scoped>
.floating-card-wrapper {
  display: inline-block;
}

.trigger-element {
  cursor: pointer;
  display: inline-block;
}

.floating-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 16px 20px;
  max-width: 500px;
  width: max-content;
  pointer-events: auto;
  will-change: transform, opacity;
}

/* 内容容器外层 */
.card-content-container {
  position: relative;
  overflow: hidden; /* 确保阴影不会超出容器 */
}

/* 内容容器 */
.card-content-wrapper {
  max-height: 300px;
  overflow: auto;
  word-break: break-word;
  padding-right: 8px;
  position: relative;
}

/* 滚动条样式优化 */
.card-content-wrapper::-webkit-scrollbar {
  width: 4px;
  height: 8px;
}
.card-content-wrapper::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}
.card-content-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

/* 固定在底部的阴影 */
.fixed-bottom-shadow {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0px; /* 考虑滚动条宽度 */
  height: 20px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.05) 30%,
    transparent 100%
  );
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.card-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0 0 8px 0;
}

.card-content p:last-child {
  margin-bottom: 0;
}
</style>
