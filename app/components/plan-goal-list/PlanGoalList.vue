<template>
  <div class="container">
    <div class="text-title">
      <span>2025年目标</span>
    </div>

    <!-- 骨架层 -->
    <div
      class="skeleton-list"
      v-if="visibleItems == null || visibleItems.length == 0"
      :style="{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }"
    >
      <div v-for="i in 6" :key="i" class="skeleton-item"></div>
    </div>

    <!-- 任务列表 -->
    <transition-group name="scale-in" tag="div" class="task-list" v-show="loaded">
      <div
        v-for="(item, index) in visibleItems"
        :key="item.id"
        class="checkbox-container"
        :style="{ transitionDelay: index * 0.1 + 's', willChange: 'opacity, transform' }"
      >
        <input
          type="checkbox"
          :id="'task-check-' + item.id"
          class="task-checkbox"
          :checked="item.completed"
          disabled
        />
        <label :for="'task-check-' + item.id" class="checkbox-label">
          <div class="checkbox-box">
            <div class="checkbox-fill"></div>
            <div class="checkmark">
              <svg viewBox="0 0 24 24" class="check-icon">
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                ></path>
              </svg>
            </div>
            <div class="success-ripple"></div>
          </div>
          <span class="checkbox-text" :class="{ 'text-completed': item.completed }">
            {{ index + 1 }}、{{ item.content }}
          </span>
        </label>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

interface PlanItem {
  id: number;
  content: string;
  completed: boolean;
}

const props = defineProps<{ data: PlanItem[] }>();

const visibleItems = ref<PlanItem[]>([]);
const loaded = ref(false);

onMounted(async () => {
  await new Promise((r) => setTimeout(r, 500)); // 模拟 API
  visibleItems.value = props.data;
  loaded.value = true;
});
</script>

<style scoped>
.container {
  width: 100%;
  --color: #e1e1e1;
  background-color: #f3f3f3;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    );
  background-size: 55px 55px;
  border-radius: 1rem;
  padding: 1rem;
}

.text-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
}

/* ---------- 骨架 ---------- */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 200px;
  transition: opacity 0.3s;
}
.skeleton-item {
  height: 22px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 37%, #e5e5e5 63%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

/* ---------- transition-group scale-in ---------- */
.scale-in-enter-from {
  opacity: 0;
  transform: scale(0.8);
}
.scale-in-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.scale-in-enter-to {
  opacity: 1;
  transform: scale(1);
}

/* ---------- checkbox 样式 ---------- */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  user-select: none;
  will-change: opacity, transform;
}
.task-checkbox {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: default;
  font-size: 16px;
  color: #374151;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 8px;
}
.checkbox-label:hover {
  background: rgba(16, 185, 129, 0.05);
  color: #111827;
}
.checkbox-box {
  position: relative;
  width: 22px;
  height: 22px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  margin-right: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  margin-top: 2.5px;
}
.checkbox-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  transform: scale(0);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border-radius: 4px;
  opacity: 0;
}
.checkmark {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: scale(0.3) rotate(20deg);
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.check-icon {
  width: 14px;
  height: 14px;
  fill: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}
.success-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(16, 185, 129, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}
.checkbox-text {
  word-break: break-word;
  flex: 1;
  display: inline-block;
  transition: all 0.3s ease;
}
.text-completed {
  text-decoration: line-through;
  color: #6b7280;
}

.task-checkbox:checked + .checkbox-label .checkbox-box {
  border-color: #10b981;
  background: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3), 0 0 0 2px rgba(16, 185, 129, 0.2);
}
.task-checkbox:checked + .checkbox-label .checkbox-fill {
  transform: scale(1);
  opacity: 1;
}
.task-checkbox:checked + .checkbox-label .checkmark {
  opacity: 1;
  transform: scale(1) rotate(0deg);
  animation: checkPop 0.3s ease-out 0.2s;
}
.task-checkbox:checked + .checkbox-label .success-ripple {
  animation: rippleSuccess 0.6s ease-out;
}

@keyframes checkPop {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
@keyframes rippleSuccess {
  0% {
    width: 0;
    height: 0;
    opacity: 0.6;
  }
  70% {
    width: 50px;
    height: 50px;
    opacity: 0.3;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}
</style>
