<template>
  <span class="hover-card-wrapper">
    <!-- 触发元素：position relative -->
    <span class="hover-card-trigger" @mouseenter="show" @mouseleave="hide">
      <slot name="trigger"></slot>
      <!-- 悬浮卡片：绝对定位相对于 hover-card-trigger -->
      <transition name="fade-up">
        <div v-if="visible" class="hover-card-content">
          <slot name="content"></slot>
        </div>
      </transition>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);

function show() {
  visible.value = true;
}

function hide(event: MouseEvent) {
  const to = event.relatedTarget as HTMLElement | null;
  const wrapper = event.currentTarget as HTMLElement;
  if (to && wrapper.contains(to)) return; // 鼠标仍在 wrapper 内，不隐藏
  visible.value = false;
}
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
  position: absolute;
  top: 100%; /* 出现在触发元素下方 */
  left: 0; /* 左对齐触发元素 */
  margin-top: 8px;
  min-width: max-content; /* 避免受父容器宽度限制 */
  max-width: 90vw; /* 防止超出屏幕 */
  background: #eedcdc;
  color: var(--font-color);
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 10px;
  font-size: 14px;
  line-height: 1.4rem;
  z-index: 999;
  white-space: normal;
  word-break: break-word;
}

/* 动画：自下而上出现，自上而下消失 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px); /* 从下往上 */
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
  transform: translateY(10px); /* 往下消失 */
}
</style>
