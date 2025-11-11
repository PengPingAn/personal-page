<template>
  <div class="container" ref="containerRef">
    <!-- 标题 + 年份选择 -->
    <div
      class="text-title"
      style="position: relative; display: inline-block; width: 100%"
    >
      <!-- 骨架屏 -->
      <span v-if="!loaded" class="skeleton-inline"></span>

      <!-- 文本 + 点击显示下拉 -->
      <span v-else @click.stop="toggleSelect" class="year-text">
        {{ visibleItems[selectIndex]?.year }}年目标
        <svg
          class="arrow"
          viewBox="0 0 24 24"
          :class="{ open: showSelect }"
          width="16"
          height="16"
        >
          <path d="M7 10l5 5 5-5H7z" fill="currentColor" />
        </svg>
      </span>

      <!-- 下拉框动画容器 -->
      <transition name="dropdown-fade">
        <div v-if="showSelect" class="dropdown-inner" @click.stop>
          <ul class="naive-dropdown">
            <li
              v-for="(item, idx) in visibleItems"
              :key="idx"
              @click="selectYear(idx)"
              class="dropdown-item"
            >
              {{ item.year }}年目标
            </li>
          </ul>
        </div>
      </transition>
    </div>

    <!-- 任务骨架列表 -->
    <div
      class="skeleton-list"
      v-if="visibleItems.length === 0 || !loaded"
      :style="{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'auto' }"
    >
      <div v-for="i in 6" :key="i" class="skeleton-item"></div>
    </div>

    <!-- 任务列表 -->
    <transition-group name="scale-in" tag="div" class="task-list" v-show="loaded">
      <div
        v-for="(item, index) in visibleItems[selectIndex]?.data || []"
        :key="index"
        class="checkbox-container"
        :style="{ transitionDelay: index * 0.1 + 's', willChange: 'opacity, transform' }"
      >
        <input
          type="checkbox"
          :id="'task-check-' + index"
          class="task-checkbox"
          :checked="item.status"
          disabled
        />
        <label :for="'task-check-' + index" class="checkbox-label">
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
          <span class="checkbox-text" :class="{ 'text-completed': item.status }">
            {{ index + 1 }}、{{ item.label }}
          </span>
        </label>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";

interface GoalItem {
  label: string;
  status: boolean;
  completionTime: string;
  showAnimation: boolean;
}

interface PlanItem {
  year: string;
  data: GoalItem[];
}

const props = defineProps<{ data: PlanItem[] }>();

const visibleItems = ref<PlanItem[]>([]);
const selectIndex = ref(0);
const showSelect = ref(false);
const loaded = ref(false);
const containerRef = ref<HTMLElement | null>(null);

// 切换下拉
function toggleSelect() {
  showSelect.value = !showSelect.value;
}

// 选择年份
function selectYear(idx: number) {
  selectIndex.value = idx;
  showSelect.value = false;
}

// 点击空白关闭下拉
function handleClickOutside(event: MouseEvent) {
  if (!containerRef.value) return;
  const target = event.target as Node;
  if (!containerRef.value.contains(target)) {
    showSelect.value = false;
  }
}

// 监听父组件数据
watch(
  () => props.data,
  async (newVal) => {
    if (newVal?.length) {
      visibleItems.value = newVal.map((plan) => ({
        ...plan,
        data: plan.data.map((item) => ({ ...item, showAnimation: false })),
      }));

      loaded.value = true;

      await nextTick();
      visibleItems.value[selectIndex.value].data.forEach((item, i) => {
        if (item.status) {
          setTimeout(() => (item.showAnimation = true), i * 100);
        }
      });
    }
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.container {
  width: 100%;
  /* border-radius: 1rem; */
  /* padding: 1rem; */
  /* backdrop-filter: blur(15px); */
  /* -webkit-backdrop-filter: blur(15px); */
  /* background-color: rgba(255, 255, 255, 0.1); */
  /* border: 1px solid rgba(255, 255, 255, 0.2); */
  color: #fff;
  max-width: none !important;
  height: 100%; /* 填满父容器高度 */
  overflow: hidden; /* 避免内部元素外溢 */
  display: flex;
  flex-direction: column;
}

.text-title {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.5rem;
  position: relative;
}
/* 美化滚动条 */
.task-list::-webkit-scrollbar {
  width: 6px;
}
.task-list::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}
.task-list::-webkit-scrollbar-track {
  background: transparent;
}

.skeleton-inline {
  display: inline-block;
  width: 60px;
  height: 1.2em;
  vertical-align: middle;
  border-radius: 6px;
  /* background: linear-gradient(90deg, #e5e5e5 25%, #f0f0f0 37%, #e5e5e5 63%); */
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

.year-text {
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.arrow {
  transition: transform 0.2s ease;
  fill: #fff;
}
.arrow.open {
  transform: rotate(180deg);
}

/* 下拉框 */
.naive-dropdown {
  position: relative;
  min-width: 120px;
  margin-top: 4px;
  border-radius: 6px;
  background: rgba(50, 50, 50, 0.95);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
  padding: 0;
  z-index: 100;
}

.dropdown-inner {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0px);
  opacity: 1;
  z-index: 11;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
.dropdown-fade-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-item {
  padding: 6px 12px;
  cursor: pointer;
  color: #fff;
  white-space: nowrap;
}
.dropdown-item:hover {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border-radius: 4px;
}

/* 骨架屏 */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 200px;
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

.task-list {
  flex: 1; /* 占满剩余空间 */
  overflow-y: auto; /* 超出时滚动 */
  padding-right: 8px; /* 避免滚动条遮盖内容 */
  margin-top: 12px;
}

/* 任务列表动画 */
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

/* 复选框动画 */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  user-select: none;
  color: #fff;
}
.task-checkbox {
  display: none;
}
.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: default;
  font-size: 16px;
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
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
  flex: 1;
  display: inline-block;
  color: #f9f9f9;
  transition: all 0.3s ease;
}
.text-completed {
  text-decoration: line-through;
  color: #f9f9f9;
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
