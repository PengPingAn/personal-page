<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-10 px-4 relative overflow-hidden"
    ref="wrapperRef"
  >
    <!-- 标题 -->
    <div
      class="text-center mb-12 md:mb-16 text-lg md:text-2xl font-bold"
      v-html="title"
    ></div>

    <div class="max-w-7xl mx-auto relative overflow-x-auto">
      <!-- 只有宽度确定后才渲染 SVG -->
      <svg
        v-if="svgReady"
        :width="svgWidth"
        :height="svgHeight"
        class="block mx-auto"
        style="overflow: visible; width: 100%; height: auto"
      >
        <!-- 表示前面还有数据的省略横线 -->
        <line
          x1="10"
          :y1="baselineY"
          x2="0"
          :y2="baselineY"
          stroke="#e9d5ff"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="35"
          :y1="baselineY"
          x2="15"
          :y2="baselineY"
          stroke="#e9d5ff"
          stroke-width="1.5"
          stroke-linecap="round"
        />

        <!-- 主线 -->
        <line
          :x1="padding"
          :y1="baselineY"
          :x2="svgWidth - padding"
          :y2="baselineY"
          stroke="#e9d5ff"
          stroke-width="1.5"
        />

        <!-- 月节点 -->
        <g v-for="(month, idx) in months" :key="`month-${month.label}`">
          <!-- 月柱 -->
          <line
            :x1="month.x"
            :y1="baselineY"
            :x2="month.x"
            :y2="baselineY - month.barHeight"
            :stroke="idx === months.length - 1 ? '#a855f7' : '#c084fc'"
            :stroke-width="monthStroke"
            stroke-linecap="round"
            class="grow-from-node cursor-pointer"
            :style="{ animationDelay: `${idx * 0.1}s` }"
            @mouseenter="showMonthTooltip(month, $event)"
            @mouseleave="hideTooltip"
          />
          <!-- 月节点圆 -->
          <circle
            :cx="month.x"
            :cy="baselineY"
            :r="3"
            :fill="idx === months.length - 1 ? '#a855f7' : '#c084fc'"
            class="cursor-pointer"
            @mouseenter="showMonthTooltip(month, $event)"
            @mouseleave="hideTooltip"
          />
          <!-- 月份文本 -->
          <text
            :x="month.x"
            :y="baselineY + 20"
            text-anchor="middle"
            :class="['fade-in-animation', 'text-xs', 'md:text-sm']"
            :style="{ animationDelay: `${idx * 0.1 + 0.3}s` }"
          >
            {{ month.label }}
          </text>
        </g>

        <!-- 每日条 -->
        <g v-for="(bar, idx) in dailyBars" :key="`bar-${idx}`">
          <line
            :x1="bar.x"
            :y1="baselineY - bar.yOffset"
            :x2="bar.x"
            :y2="baselineY - bar.height - bar.yOffset"
            :stroke="bar.color"
            :stroke-width="dailyStroke"
            stroke-linecap="round"
            class="rain-animation cursor-pointer"
            :style="{ animationDelay: `${idx * 0.02}s` }"
            @mouseenter="showDailyTooltip(bar, $event)"
            @mouseleave="hideTooltip"
          />
        </g>
      </svg>

      <!-- Tooltip -->
      <Transition name="tooltip">
        <div
          v-if="tooltip.visible"
          class="absolute bg-white shadow-xl rounded-lg px-3 py-2 pointer-events-none z-50 border border-purple-200 max-w-xs break-words"
          :style="tooltipStyle"
        >
          <div class="text-xs text-gray-500 whitespace-nowrap md:whitespace-normal">
            {{ tooltip.date }}
          </div>
          <div class="text-sm font-semibold text-purple-600">{{ tooltip.countText }}</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, onMounted, onUnmounted } from "vue";

interface DailyItem {
  day: number;
  title: string;
}
interface TimelineMonth {
  label: string;
  total: number;
  daily: DailyItem[];
}

const props = defineProps<{
  title: string;
  timelineData: TimelineMonth[];
}>();

// ------------------- 自适应容器 -------------------
const wrapperRef = ref<HTMLElement | null>(null);
const svgWidth = ref(0);
const svgHeight = ref(260);
const baselineY = ref(130);
const svgReady = ref(false);
const padding = ref(40);
let resizeObserver: ResizeObserver | null = null;

// 月柱和每日条宽度
const monthStroke = ref(4);
const dailyStroke = ref(2);

onMounted(() => {
  if (!wrapperRef.value) return;

  const updateWidth = () => {
    svgWidth.value = wrapperRef.value!.clientWidth;
    svgHeight.value = (svgWidth.value / 960) * 260;
    baselineY.value = svgHeight.value / 2;

    monthStroke.value = Math.min(3, Math.max(2, (svgWidth.value / 960) * 4));
    dailyStroke.value = Math.min(2, Math.max(1.5, (svgWidth.value / 960) * 2.5));

    svgReady.value = true;
  };

  updateWidth();
  resizeObserver = new ResizeObserver(updateWidth);
  resizeObserver.observe(wrapperRef.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

// ------------------- Tooltip -------------------
const tooltip = ref({ visible: false, x: 0, y: 0, date: "", countText: "" });
const tooltipStyle = computed(() => {
  if (!tooltip.value.visible) return {};
  let x = tooltip.value.x;
  let y = tooltip.value.y;
  const halfWidth = 100;
  x = Math.min(Math.max(x, halfWidth), svgWidth.value - halfWidth);
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: "translate(-50%, -120%)",
  };
});

// ------------------- 数据计算 -------------------
function getMonthDays(label: string) {
  const [year, month] = label.split(".").map(Number);
  return new Date(year, month, 0).getDate();
}

const extendRatio = 0.08;

// 月份计算
const months = computed(() => {
  if (!svgReady.value || svgWidth.value === 0) return [];
  const usableWidth = svgWidth.value - 2 * padding.value;
  const monthCount = props.timelineData.length;
  const extend = usableWidth * extendRatio;
  const spacing = (usableWidth - 2 * extend) / Math.max(1, monthCount - 1);

  return props.timelineData.map((m, i) => ({
    label: m.label,
    x: padding.value + extend + spacing * i,
    total: m.total,
    barHeight: Math.min(m.total * ((svgHeight.value / 260) * 10), svgHeight.value / 2),
    daily: m.daily,
  }));
});

// 每日条
const dailyBars = computed(() => {
  if (!svgReady.value || svgWidth.value === 0) return [];
  const bars: any[] = [];
  const barHeight = Math.max(6, (svgHeight.value / 260) * 10);
  const gap = 4;

  months.value.forEach((month, idx) => {
    const nextMonth = months.value[idx + 1] || { x: svgWidth.value - padding.value };
    const span = nextMonth.x - month.x;
    const daysInMonth = getMonthDays(month.label);
    const usedPerDay: Record<number, number> = {};

    month.daily.forEach((post) => {
      const sameDayCount = (usedPerDay[post.day] || 0) + 1;
      usedPerDay[post.day] = sameDayCount;

      const offsetRatio = (post.day - 1) / daysInMonth;
      const offset = offsetRatio * span * 0.9 + span * 0.05;
      const yOffset = (sameDayCount - 1) * (barHeight + gap);

      bars.push({
        x: month.x + offset,
        height: barHeight,
        yOffset,
        color: "#c084fc",
        date: `${month.label}.${post.day}`,
        title: post.title,
      });
    });
  });
  return bars;
});

// ------------------- Tooltip 显示 -------------------
const showDailyTooltip = (bar: any) => {
  tooltip.value = {
    visible: true,
    x: bar.x,
    y: baselineY.value - bar.height - bar.yOffset,
    date: bar.date,
    countText: bar.title,
  };
};

const showMonthTooltip = (month: any) => {
  tooltip.value = {
    visible: true,
    x: month.x,
    y: baselineY.value - month.barHeight - 10,
    date: month.label,
    countText: `本月共发布 ${month.total} 篇文章`,
  };
};

const hideTooltip = () => (tooltip.value.visible = false);
</script>

<style scoped>
/* 月柱生长 */
@keyframes grow-from-node {
  0% {
    stroke-dasharray: 0 100;
  }
  100% {
    stroke-dasharray: 100 0;
  }
}
.grow-from-node {
  stroke-dasharray: 0 100;
  animation: grow-from-node 0.6s ease forwards;
}

/* 月份淡入 */
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.fade-in-animation {
  opacity: 0;
  animation: fade-in 0.5s ease forwards;
}

/* 每日条雨点落下 */
@keyframes rain-drop {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
.rain-animation {
  transform-origin: top;
  transform: scaleY(0);
  opacity: 0;
  animation: rain-drop 0.5s ease forwards;
}

/* Tooltip 动画 */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%) scale(0.9);
}
</style>
