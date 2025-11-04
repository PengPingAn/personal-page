<template>
  <div
    class="card"
    :class="{ hover: isHover }"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- 毛玻璃背景 -->
    <div class="card-blur"></div>

    <!-- 卡片主体（支持自定义类名） -->
    <div class="card-body" :class="bodyClass">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-content">
        <slot>
          {{ content }}
        </slot>
      </p>
    </div>

    <!-- 卡片底部操作 -->
    <div v-if="$slots.footer || actions.length" class="card-footer">
      <slot name="footer">
        <button
          v-for="(action, index) in actions"
          :key="index"
          @click="action.onClick"
          class="card-btn"
        >
          {{ action.label }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  actions: {
    type: Array,
    default: () => [],
  },
  /** 👉 新增：自定义 card-body 的 class */
  bodyClass: {
    type: [String, Array, Object],
    default: "",
  },
});

const isHover = ref(false);
</script>

<style scoped>
.card {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  cursor: default;
  color: #fff;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
}
.card.hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-body,
.card-footer {
  position: relative;
  z-index: 1;
}

.card-body {
  padding: 16px;
  height: 100%;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  margin: 0;
  font-size: 14px;
  color: #fff;
}

.card-footer {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.card-btn {
  padding: 6px 12px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
