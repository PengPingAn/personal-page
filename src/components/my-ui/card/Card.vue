<template>
  <div
    class="card"
    :class="{ hover: isHover }"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <!-- 卡片封面/图片 -->
    <div v-if="image" class="card-image">
      <img :src="image" :alt="title" />
    </div>

    <!-- 卡片主体 -->
    <div class="card-body">
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

// props
defineProps({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  actions: {
    type: Array,
    default: () => [],
    // 每个 action: { label: string, onClick: Function }
  },
});

// hover 状态
const isHover = ref(false);
</script>

<style scoped>
.card {
  width: 100%;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: #fff;
  cursor: default;
}

.card.hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-image img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-body {
  padding: 16px;
}

.card-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.card-content {
  margin: 0;
  font-size: 14px;
  color: #555;
}

.card-footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.card-btn {
  padding: 6px 12px;
  border: none;
  background-color: #409eff;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.card-btn:hover {
  background-color: #66b1ff;
}
</style>
