<template>
  <div class="min-h-[150px] text-[#FFF]">
    <div v-for="group in timelineData" :key="group.year" class="mb-6">
      <!-- 年份标题 -->
      <div class="flex gap-4 mb-4">
        <div class="h-auto w-[2px] bg-[#e16060]"></div>
        <span class="font-bold text-xl">
          <!-- 如果是加载中的分组，显示骨架 -->
          <template v-if="group.year === 'loading'">
            <span
              class="skeleton-text"
              :style="{ width: getRandomWidth(60, 100) + 'px', display: 'inline-block' }"
            ></span>
          </template>

          <!-- 真实数据 -->
          <template v-else>
            {{ group.year }}
            <span class="text-xs text-[#FFF]">（{{ group.items.length }}）</span>
          </template>
        </span>
      </div>

      <!-- 条目 -->
      <transition-group name="fly-in" tag="div">
        <div
          v-for="(item, index) in group.items"
          :key="item.id"
          class="flex gap-4 relative timeline-item"
          :style="{
            transitionDelay: index * 0.08 + 's',
            willChange: 'opacity, transform',
          }"
        >
          <!-- 左侧圆点及上下连线 -->
          <div
            class="relative flex items-center justify-center"
            :class="[
              index !== 0 ? 'before-line' : '',
              index !== group.items.length - 1 ? 'after-line' : '',
            ]"
          >
            <div class="w-2 h-2 bg-[#fff] rounded-full z-10"></div>
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
                <template v-else>
                  <a :href="item.link" target="_blank">{{ item.title }}</a>
                </template>
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
                <span>心情：{{ item.mood }}</span> /
                <span>天气：{{ item.weather }}</span> / <span>{{ item.type }}</span>
              </template>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <div class="my-4 text-right">
      <HoverLink :href="blogLink" color="#FFF" text="还有更多，去看看？" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useNuxtApp } from "#app";

interface TimelineItem {
  id: number;
  fullTime: string;
  time: string;
  title: string;
  mood: string;
  weather: string;
  type: string;
  loaded: boolean;
  link: string;
}

interface TimelineGroup {
  year: string;
  items: TimelineItem[];
}

const props = defineProps({ rss: { type: String, default: "" } });
const { $toast } = useNuxtApp();

const timelineData = ref<TimelineGroup[]>([]);
const blogLink = ref("");

function getRandomWidth(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDisplayDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

function groupByYear(data: TimelineItem[]): TimelineGroup[] {
  const groups: Record<string, TimelineItem[]> = {};
  data.forEach((item) => {
    const year = new Date(item.fullTime).getFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });
  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, items: groups[year] || [] }));
}

/**
 * 固定结构的骨架屏：一个分组、3 条项目
 * 避免按年份生成导致骨架年份跳动与条目逐条消失
 */
function initSkeleton(rowCount = 3) {
  const items: TimelineItem[] = Array.from({ length: rowCount }, (_, i) => ({
    id: i + 1,
    fullTime: "loading",
    time: "",
    title: "",
    mood: "",
    weather: "",
    type: "",
    loaded: false,
    link: "",
  }));

  // 固定一个加载分组
  timelineData.value = [
    {
      year: "loading",
      items,
    },
  ];
}

async function getRss(rss: string) {
  try {
    const res = await $request.Get("rss", { url: rss });
    if (res.code === 200) {
      const items: TimelineItem[] = res.data.item.map((e: any, index: number) => ({
        id: index + 1,
        fullTime: e.pubDate,
        time: formatDisplayDate(e.pubDate),
        title: e.title,
        mood: "兴奋",
        weather: "晴",
        type: "手记",
        loaded: true,
        link: e.link,
      }));

      timelineData.value = groupByYear(items);
      blogLink.value = res.data.blogLink;
    } else {
      $toast?.error("获取失败");
    }
  } catch (err) {
    console.error("获取RSS失败", err);
  }
}

onMounted(() => initSkeleton(5));

watch(
  () => props.rss,
  (newRss) => {
    if (newRss) getRss(newRss);
  }
);
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
  max-width: 220px;
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
</style>
