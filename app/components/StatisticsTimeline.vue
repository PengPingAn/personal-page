<template>
  <div
    class="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-10 px-4 relative"
    ref="wrapperRef"
  >
    <!-- 标题 -->
    <div
      class="text-center mb-12 md:mb-16 text-lg md:text-2xl font-bold"
      v-html="title"
    ></div>

    <div
      class="max-w-7xl mx-auto relative timeline-container"
      :class="{ scrollable: containerWidth < minSvgWidth }"
    >
      <!-- 只有宽度确定后才渲染 SVG -->
      <svg
        v-if="svgReady"
        :width="actualSvgWidth"
        :height="svgHeight"
        class="block mx-auto timeline-svg"
        :style="{
          'min-width': `${minSvgWidth}px`,
          '--baseline-y': baselineY + 'px',
          '--month-stroke': monthStroke + 'px',
          '--daily-stroke': dailyStroke + 'px',
        }"
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
          :x1="contentStartX"
          :y1="baselineY"
          :x2="contentEndX"
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
            :r="monthNodeRadius"
            :fill="idx === months.length - 1 ? '#a855f7' : '#c084fc'"
            class="cursor-pointer"
            @mouseenter="showMonthTooltip(month, $event)"
            @mouseleave="hideTooltip"
          />
          <!-- 月份文本 -->
          <text
            :x="month.x"
            :y="baselineY + textOffset"
            text-anchor="middle"
            :class="['fade-in-animation', 'text-xs', 'md:text-sm']"
            :style="{ animationDelay: `${idx * 0.1 + 0.3}s` }"
            :font-size="textSize"
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

        <!-- 右侧预留空间指示线（不显示圆点和文字） -->
        <line
          :x1="virtualMonthX"
          :y1="baselineY - 5"
          :x2="virtualMonthX"
          :y2="baselineY + 5"
          stroke="#e9d5ff"
          stroke-width="1"
          stroke-dasharray="2,2"
        />
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

// ------------------- 配置参数 -------------------
// 这些参数可以根据需要调整
const config = {
  minSvgWidth: 800, // 最小宽度，小于此宽度会出现滚动
  maxSvgWidth: 1200, // 最大宽度
  svgHeight: 200, // SVG 高度
  baselineY: 100, // 基线位置
  padding: 40, // 内边距
  monthSpacing: 70, // 月份间距基数
  barHeight: 10, // 每日条高度
  barGap: 3, // 每日条间隙
  barHeightMultiplier: 11, // 月柱高度乘数
};

// ------------------- 响应式数据 -------------------
const wrapperRef = ref<HTMLElement | null>(null);
const containerWidth = ref(0);
const svgReady = ref(false);
let resizeObserver: ResizeObserver | null = null;

// 动态计算的尺寸
const monthStroke = ref(3);
const dailyStroke = ref(1.5);
const monthNodeRadius = ref(3);
const textSize = ref(12);
const textOffset = ref(20);

// 从配置中获取值
const {
  minSvgWidth,
  maxSvgWidth,
  svgHeight,
  baselineY,
  padding,
  monthSpacing,
  barHeight,
  barGap,
  barHeightMultiplier,
} = config;

// 计算实际 SVG 宽度
const actualSvgWidth = computed(() => {
  const monthCount = props.timelineData.length;
  // 计算所需的最小宽度（基于月份数量+1个虚拟月份和间距）
  const requiredWidth = (monthCount + 1) * monthSpacing + padding * 2;

  // 使用容器宽度和所需宽度的较大值，但不超过最大宽度
  return Math.min(Math.max(containerWidth.value, requiredWidth), maxSvgWidth);
});

// 计算内容区域的起始和结束位置（用于居中）
const contentStartX = computed(() => {
  return padding;
});

const contentEndX = computed(() => {
  return actualSvgWidth.value - padding;
});

// 计算虚拟月份的位置（最右侧）
const virtualMonthX = computed(() => {
  const monthCount = props.timelineData.length;
  const usableWidth = actualSvgWidth.value - 2 * padding;
  const spacing = usableWidth / monthCount;

  return padding + spacing * monthCount;
});

// 计算内容总宽度和偏移量，用于居中
const contentWidth = computed(() => {
  return virtualMonthX.value - padding;
});

const contentOffset = computed(() => {
  return (actualSvgWidth.value - contentWidth.value) / 2;
});

onMounted(() => {
  if (!wrapperRef.value) return;

  const updateDimensions = () => {
    containerWidth.value = wrapperRef.value!.clientWidth;

    // 根据容器宽度动态调整各种尺寸
    const scale = Math.min(containerWidth.value / minSvgWidth, 1.5);

    // 线条宽度
    monthStroke.value = Math.min(3, Math.max(2, 3 * scale));
    dailyStroke.value = Math.min(1.5, Math.max(1, 1.5 * scale));

    // 节点半径
    monthNodeRadius.value = Math.min(3.5, Math.max(2.5, 3 * scale));

    // 文本大小和偏移
    textSize.value = Math.min(14, Math.max(10, 12 * scale));
    textOffset.value = Math.min(25, Math.max(18, 20 * scale));

    svgReady.value = true;
  };

  updateDimensions();
  resizeObserver = new ResizeObserver(updateDimensions);
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
  x = Math.min(Math.max(x, halfWidth), actualSvgWidth.value - halfWidth);
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

// 月份计算 - 修正居中问题
const months = computed(() => {
  if (!svgReady.value || actualSvgWidth.value === 0) return [];

  const monthCount = props.timelineData.length;

  // 计算间距，确保内容居中
  const spacing = contentWidth.value / monthCount;

  return props.timelineData.map((m, i) => ({
    label: m.label,
    x: contentOffset.value + spacing * i,
    total: m.total,
    barHeight: Math.min(m.total * barHeightMultiplier, svgHeight / 2 - 15),
    daily: m.daily,
  }));
});

// 每日条计算 - 修正居中问题
const dailyBars = computed(() => {
  if (!svgReady.value || actualSvgWidth.value === 0) return [];
  const bars: any[] = [];

  months.value.forEach((month, idx) => {
    // 确定当前月份的结束位置
    let endX;
    if (idx === months.value.length - 1) {
      // 最后一个月份使用虚拟月份位置作为结束
      endX = contentOffset.value + contentWidth.value;
    } else {
      // 其他月份使用下一个真实月份的位置
      endX = months.value[idx + 1].x;
    }

    const startX = month.x;
    const monthWidth = endX - startX;

    const daysInMonth = getMonthDays(month.label);
    const usedPerDay: Record<number, number> = {};

    month.daily.forEach((post) => {
      const sameDayCount = (usedPerDay[post.day] || 0) + 1;
      usedPerDay[post.day] = sameDayCount;

      const dayRatio = (post.day - 1) / daysInMonth;
      const x = startX + dayRatio * monthWidth * 0.85 + monthWidth * 0.075;
      const yOffset = (sameDayCount - 1) * (barHeight + barGap);

      bars.push({
        x: x,
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

// 更新虚拟月份位置计算
const updatedVirtualMonthX = computed(() => {
  return contentOffset.value + contentWidth.value;
});

// ------------------- Tooltip 显示 -------------------
const showDailyTooltip = (bar: any) => {
  tooltip.value = {
    visible: true,
    x: bar.x,
    y: baselineY - bar.height - bar.yOffset,
    date: bar.date,
    countText: bar.title,
  };
};

const showMonthTooltip = (month: any) => {
  tooltip.value = {
    visible: true,
    x: month.x,
    y: baselineY - month.barHeight - 10,
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

/* 确保 SVG 文本样式 */
svg text {
  fill: #374151;
}

/* 容器样式 */
.timeline-container {
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* 可滚动容器样式 */
.timeline-container.scrollable {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.timeline-container.scrollable::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

/* SVG 样式 */
.timeline-svg {
  overflow: visible;
  transition: all 0.3s ease;
  display: block;
}

/* 响应式文本 */
@media (min-width: 768px) {
  svg text {
    font-size: 14px;
  }
}

/* 确保内容居中 */
.timeline-svg {
  margin-left: auto;
  margin-right: auto;
}
</style>
