<template>
  <!-- 整个时间线包裹在 Transition 中 -->
  <transition name="fly-in" appear>
    <div>
      <div class="flex gap-4 mb-4">
        <div class="h-auto w-[2px] bg-[#e16060]"></div>
        <span class="font-bold text-xl">
          2025
          <span class="text-xs text-[#646464]"> （{{ timelineData.length }}） </span>
        </span>
      </div>

      <div v-for="item in timelineData" :key="item.id" class="flex gap-4 relative">
        <div
          class="relative flex items-center justify-center"
          :class="[
            timelineData.indexOf(item) !== 0 ? 'before-line' : '',
            timelineData.indexOf(item) !== timelineData.length - 1 ? 'after-line' : '',
          ]"
        >
          <div class="w-2 h-2 bg-gray-700 rounded-full z-10"></div>
        </div>

        <div
          class="flex justify-between w-full border-b border-gray-200 items-center text-[15px] text-[#646464] leading-8"
        >
          <div class="flex gap-4 items-center cursor-pointer">
            <div class="text-sm text-gray-500">{{ item.time }}</div>
            <div class="title-hover">{{ item.title }}</div>
          </div>
          <div class="text-sm text-gray-500 flex gap-2 items-center">
            <span>心情：{{ item.mood }}</span> / <span>天气：{{ item.weather }}</span> /
            <span>{{ item.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from "vue";

const timelineData = ref([
  {
    id: 1,
    time: "02/05",
    title: "镜头与代码的交响",
    mood: "开心",
    weather: "阴",
    type: "手记",
  },
  {
    id: 2,
    time: "02/06",
    title: "第二条记录",
    mood: "平静",
    weather: "晴",
    type: "手记",
  },
  {
    id: 3,
    time: "02/07",
    title: "第三条记录",
    mood: "兴奋",
    weather: "雨",
    type: "手记",
  },
]);
</script>

<style scoped>
.before-line::before,
.after-line::after {
  content: "";
  position: absolute;
  width: 1px;
  background-color: #d1d5db;
  left: 50%;
  transform: translateX(-50%);
}
.before-line::before {
  top: 0;
  bottom: 50%;
}
.after-line::after {
  top: 50%;
  bottom: 0;
}

.title-hover {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
.title-hover::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 5px;
  width: 100%;
  height: 1px;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.title-hover:hover::after {
  transform: scaleX(1);
}

/* ---------- 整体飞入动画 ---------- */
.fly-in-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fly-in-enter-active {
  transition: all 0.5s ease;
}
.fly-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
