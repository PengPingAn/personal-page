<template>
  <div class="container">
    <div class="text-title">
      <span>2025年目标</span>
    </div>

    <transition-group name="scale-in" tag="div" appear>
      <div
        class="checkbox-container"
        v-for="(item, index) in items"
        :key="item.id"
        :style="{ transitionDelay: index * 0.1 + 's' }"
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
import { ref, onMounted } from "vue";

interface PlanItem {
  id: number;
  content: string;
  completed: boolean;
}

const props = defineProps<{ data: PlanItem[] }>();

const items = ref<PlanItem[]>([]);

onMounted(() => {
  props.data.forEach((item, index) => {
    setTimeout(() => {
      items.value.push(item);
    }, index * 100);
  });
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
  max-width: 400px;
}

.text-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
}

/* 父容器固定高度，避免抖动 */
.checkbox-container {
  user-select: none;
  display: flex;
  align-items: flex-start;
}

/* 缩放动画 */
.scale-in-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.scale-in-enter-active {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.scale-in-enter-to {
  transform: scale(1);
  opacity: 1;
}

.task-checkbox {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: default;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  margin-top: 2.5px;
}

.checkbox-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

/* 删除线只作用文字 */
.text-completed {
  text-decoration: line-through;
  color: #6b7280;
}

/* 勾选效果 */
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
