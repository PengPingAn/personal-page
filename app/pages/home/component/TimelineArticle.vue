<template>
  <div class="min-h-[150px] text-[#FFF]">
    <div class="flex gap-4 mb-4">
      <div class="h-auto w-[2px] bg-[#e16060]"></div>
      <span class="font-bold text-xl">
        2025
        <span class="text-xs text-[#FFF]"> （{{ timelineData?.length ?? 0 }}） </span>
      </span>
    </div>

    <transition-group name="fly-in" tag="div">
      <div
        v-for="(item, index) in visibleItems"
        :key="item.id"
        class="flex gap-4 relative timeline-item"
        :style="{ transitionDelay: index * 0.08 + 's', willChange: 'opacity, transform' }"
      >
        <!-- 左侧圆点及上下连线 -->
        <div
          class="relative flex items-center justify-center"
          :class="[
            index !== 0 ? 'before-line' : '',
            index !== visibleItems.length - 1 ? 'after-line' : '',
          ]"
        >
          <div class="w-2 h-2 bg-gray-700 bg-[#fff] rounded-full z-10"></div>
        </div>

        <!-- 内容 -->
        <div
          class="flex justify-between w-full border-b border-gray-200 items-center text-[15px] text-[#FFF] leading-8"
        >
          <!-- 左侧文字 -->
          <div class="flex gap-4 items-center cursor-pointer">
            <div class="text-sm">
              <template v-if="!item.loaded">
                <span
                  class="skeleton-text"
                  :style="{ width: getRandomWidth(40, 70) + 'px' }"
                ></span>
              </template>
              <template v-else>{{ item.time }}</template>
            </div>
            <div class="title-hover">
              <template v-if="!item.loaded">
                <span
                  class="skeleton-text"
                  :style="{ width: getRandomWidth(100, 200) + 'px' }"
                ></span>
              </template>
              <template v-else>{{ item.title }}</template>
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="text-sm flex gap-2 items-center">
            <template v-if="!item.loaded">
              <span
                class="skeleton-text"
                :style="{ width: getRandomWidth(50, 70) + 'px' }"
              ></span>
              /
              <span
                class="skeleton-text"
                :style="{ width: getRandomWidth(40, 60) + 'px' }"
              ></span>
              /
              <span
                class="skeleton-text"
                :style="{ width: getRandomWidth(30, 50) + 'px' }"
              ></span>
            </template>
            <template v-else>
              <span>心情：{{ item.mood }}</span> / <span>天气：{{ item.weather }}</span> /
              <span>{{ item.type }}</span>
            </template>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

interface TimelineItem {
  id: number;
  time: string;
  title: string;
  mood: string;
  weather: string;
  type: string;
  loaded?: boolean;
}

// 初始 null，模拟 API 未获取数据
const timelineData = ref<TimelineItem[] | null>(null);
const visibleItems = ref<TimelineItem[]>([]);

onMounted(() => {
  // 模拟骨架占位：使用未来真实数据 id 占位
  const skeletonData: TimelineItem[] = [
    { id: 1, loaded: false } as TimelineItem,
    { id: 2, loaded: false } as TimelineItem,
    { id: 3, loaded: false } as TimelineItem,
  ];
  visibleItems.value = skeletonData;

  // 模拟 API 延迟
  setTimeout(() => {
    const data: TimelineItem[] = [
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
    ];
    timelineData.value = data;

    // 更新 visibleItems 内容，同时保持 key 一致
    visibleItems.value = data.map((item) => ({ ...item, loaded: true }));
  }, 1500);
});

// 随机骨架长度
function getRandomWidth(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
</script>

<style scoped>
.before-line::before,
.after-line::after {
  content: "";
  position: absolute;
  width: 1px;
  background-color: #fff;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px; /* 可根据布局调整 */
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

/* 飞入动画 */
.fly-in-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fly-in-enter-active {
  transition-property: opacity, transform;
  transition-duration: 0.5s;
  transition-timing-function: ease;
}
.fly-in-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 骨架屏样式 */
.timeline-item {
  line-height: 32px;
}
.skeleton-text {
  display: inline-block;
  height: 1em;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeletonShimmer 1.2s infinite linear;
}
@keyframes skeletonShimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 左侧时间文字 */
.timeline-item .flex > div:first-child .text-sm {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40px; /* 时间最大宽度 */
}

/* 右侧信息文字 */
.timeline-item .text-sm.text-gray-500 {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
}
.timeline-item .text-sm.text-gray-500 span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px; /* 每段信息最大宽度 */
}

/* 响应式：移动端隐藏右侧信息，调整标题宽度 */
@media (max-width: 768px) {
  .title-hover {
    max-width: 180px; /* 腾出空间给标题 */
  }
  .timeline-item .text-sm.text-gray-500 {
    display: none; /* 隐藏心情/天气/类型 */
  }
  .timeline-item .flex > div:first-child .text-sm {
    max-width: 60px; /* 时间宽度可稍微增加 */
  }
}
</style>
