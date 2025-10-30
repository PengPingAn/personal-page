<template>
  <span class="hover-card-wrapper">
    <!-- 触发元素 -->
    <span
      ref="triggerRef"
      class="hover-card-trigger"
      @mouseenter="onTriggerEnter"
      @mouseleave="onTriggerLeave"
    >
      <slot name="trigger"></slot>
    </span>

    <!-- 卡片 teleport 到 body -->
    <teleport to="body">
      <transition name="fade-up">
        <div
          v-if="visible"
          ref="cardRef"
          class="hover-card-content"
          :style="cardStyle"
          @mouseenter="onCardEnter"
          @mouseleave="onCardLeave"
        >
          <slot name="content"></slot>
        </div>
      </transition>
    </teleport>
  </span>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, onUnmounted } from "vue";

const triggerRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const visible = ref(false);
const inside = ref(false);
let hideTimer: number | null = null;
const firstPositioned = ref(false); // 标记首次已初始化位置

const cardStyle = reactive({
  position: "absolute",
  top: "0px",
  left: "0px",
  zIndex: 9999,
  maxHeight: "80vh",
  overflowY: "auto",
  transition: "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
});

function clearHideTimer() {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

async function onTriggerEnter() {
  clearHideTimer();
  visible.value = true;

  await nextTick();

  if (!firstPositioned.value) {
    // 首次显示，直接定位，去掉动画
    cardStyle.transition = "none";
    positionCard();
    firstPositioned.value = true;
    await nextTick();
    cardStyle.transition = "all 0.25s cubic-bezier(0.22, 1, 0.36, 1)";
  } else {
    positionCard();
  }
}

function onTriggerLeave() {
  clearHideTimer();
  hideTimer = window.setTimeout(() => {
    if (!inside.value) visible.value = false;
    hideTimer = null;
  }, 80);
}

function onCardEnter() {
  inside.value = true;
  clearHideTimer();
}

function onCardLeave() {
  inside.value = false;
  clearHideTimer();
  hideTimer = window.setTimeout(() => {
    if (!inside.value) visible.value = false;
    hideTimer = null;
  }, 80);
}

function positionCard() {
  const trigger = triggerRef.value;
  const card = cardRef.value;
  if (!trigger || !card) return;

  const rect = trigger.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const margin = 8;

  // 先计算默认位置：下方
  let top = rect.bottom + scrollY + margin;
  const left = rect.left + scrollX;

  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;

  nextTick(() => {
    const cardRect = card.getBoundingClientRect();
    // 下方空间不足，上方显示
    const spaceBelow = windowHeight - rect.bottom;
    if (spaceBelow < cardRect.height + margin) {
      const spaceAbove = rect.top;
      if (spaceAbove > cardRect.height + margin) {
        top = rect.top + scrollY - cardRect.height - margin;
      } else {
        // 上下都不够，高度自适应
        const maxH = Math.max(spaceAbove, spaceBelow) - margin;
        cardStyle.maxHeight = maxH + "px";
        top = rect.bottom + scrollY + margin;
      }
    } else {
      cardStyle.maxHeight = "80vh"; // 恢复默认最大高度
    }

    // 防止右边溢出
    if (cardRect.right > windowWidth - margin) {
      const overflow = cardRect.right - (windowWidth - margin);
      cardStyle.left = Math.max(margin, left - overflow) + "px";
    } else {
      cardStyle.left = left + "px";
    }

    cardStyle.top = top + "px";
  });
}

// 窗口滚动/尺寸变化更新位置
function onWindowChange() {
  if (visible.value) positionCard();
}

onMounted(() => {
  window.addEventListener("scroll", onWindowChange, true);
  window.addEventListener("resize", onWindowChange);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onWindowChange, true);
  window.removeEventListener("resize", onWindowChange);
});
</script>

<style scoped lang="scss">
.hover-card-wrapper {
  display: inline-block;
}

.hover-card-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.hover-card-content {
  width: max-content;
  position: absolute;
  min-width: max-content;
  max-width: 90vw;
  background: #eedcdc;
  color: var(--font-color);
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4rem;
  z-index: 9999;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  overflow-y: auto;
}

/* 保留原有动画 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
