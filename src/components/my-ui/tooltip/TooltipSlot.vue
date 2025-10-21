<template>
  <span class="hover-card-wrapper">
    <!-- 触发元素：position relative -->
    <span
      ref="triggerRef"
      class="hover-card-trigger"
      @mouseenter="onTriggerEnter"
      @mouseleave="onTriggerLeave"
    >
      <slot name="trigger"></slot>
    </span>

    <!-- 卡片 teleport 到 body（避免被父容器遮挡） -->
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
import { ref, reactive, nextTick, onUnmounted } from "vue";

/**
 * 最小改动版 HoverCard
 * - teleport -> 避免 stacking-context 遮挡
 * - 采用短延时 hide 逻辑，避免鼠标在 trigger <-> card 之间抖动导致误隐藏
 * - 位置在 nextTick 后计算，防止第一次渲染位置闪动
 */

const triggerRef = ref<HTMLElement | null>(null);
const cardRef = ref<HTMLElement | null>(null);

const visible = ref(false);
const inside = ref(false); // 鼠标是否在卡片内
let hideTimer: number | null = null;

const cardStyle = reactive({
  position: "absolute",
  top: "0px",
  left: "0px",
  zIndex: 9999,
  // 不在这里写 transform/translateY，让 CSS transition 控制动画
});

function clearHideTimer() {
  if (hideTimer !== null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
}

// 触发进入
async function onTriggerEnter() {
  clearHideTimer();
  // 先显示，再定位（nextTick），避免卡片无法定位或闪烁
  visible.value = true;
  await nextTick();
  positionCard();
}

// 触发离开——延迟隐藏，给予转移到卡片的缓冲窗口
function onTriggerLeave(event?: MouseEvent) {
  clearHideTimer();
  hideTimer = window.setTimeout(() => {
    // 如果仍在卡片内（inside），则不隐藏
    if (!inside.value) visible.value = false;
    hideTimer = null;
  }, 80); // 80ms 缓冲，可微调
}

// 卡片进入（鼠标移动到卡片上）
function onCardEnter() {
  inside.value = true;
  clearHideTimer();
}

// 卡片离开（移出卡片）
function onCardLeave() {
  inside.value = false;
  // 小延时隐藏，允许快速回到 trigger
  clearHideTimer();
  hideTimer = window.setTimeout(() => {
    if (!inside.value) visible.value = false;
    hideTimer = null;
  }, 80);
}

// 计算卡片位置（左对齐、紧贴触发元素下方）
function positionCard() {
  const trigger = triggerRef.value;
  const card = cardRef.value;
  if (!trigger || !card) return;

  const rect = trigger.getBoundingClientRect();
  // left：触发元素 left（左对齐）
  // top：trigger bottom + 8px（微间距），考虑滚动条位移
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  cardStyle.left = rect.left + scrollX + "px";
  cardStyle.top = rect.bottom + scrollY + 8 + "px";

  // 限制不要溢出右边界（若超出，则向左调整）
  nextTick(() => {
    const cardRect = card.getBoundingClientRect();
    const margin = 8;
    if (cardRect.right > window.innerWidth - margin) {
      const overflow = cardRect.right - (window.innerWidth - margin);
      const leftPx = (parseFloat(cardStyle.left) || 0) - overflow;
      cardStyle.left = Math.max(margin, leftPx) + "px";
    }
  });
}

// 当窗口滚动或尺寸变化时更新位置（若可见）
function onWindowChange() {
  if (visible.value) positionCard();
}

window.addEventListener("scroll", onWindowChange);
window.addEventListener("resize", onWindowChange);
onUnmounted(() => {
  clearHideTimer();
  window.removeEventListener("scroll", onWindowChange);
  window.removeEventListener("resize", onWindowChange);
});
</script>

<style scoped lang="scss">
.hover-card-wrapper {
  display: inline-block;
  /* 不要设 width:100% ——保持原始行为 */
}

.hover-card-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* 保持原始样式（你已有的样式） */
.hover-card-content {
  position: absolute; /* 但最终用 teleport 时，这只是语义，样式仍适用 */
  top: 100%; /* 如果没有 teleport 时仍兼容（不影响） */
  left: 0;
  margin-top: 8px;
  min-width: max-content; /* 宽度随内容扩展 */
  max-width: 90vw;
  background: #eedcdc;
  color: var(--font-color);
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4rem;
  z-index: 9999; /* 高z */
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* 保留你原来的动画：自下而上出现，自上而下消失 */
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
