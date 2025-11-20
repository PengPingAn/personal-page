<template>
  <Motion
    :class="cn('relative select-none w-full h-full', props.class)"
    :style="{ cursor: cursorImg }"
    :initial="{ scale: 1, rotate: [0, 10, -10, 10, -10, 0] }"
    :transition="{ duration: 0.5 }"
  >
    <!-- 包一层 div 用于 ResizeObserver -->
    <div ref="containerRef" class="w-full h-full relative">
      <canvas
        ref="canvasRef"
        class="absolute left-0 top-0 w-full h-full"
        @mousedown="handleMouseDown"
        @touchstart="handleTouchStart"
      />
      <slot />
    </div>
  </Motion>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { Motion, useAnimate } from "motion-v";
import { ref, onMounted, onUnmounted, watch, type Ref } from "vue";

const cursorImg =
  "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNSIgc3R5bGU9ImZpbGw6I2ZmZjtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MXB4OyIgLz4KPC9zdmc+'), auto";

interface Props {
  class?: string;
  minScratchPercentage?: number;
  gradientColors?: [string, string, string];
}

const props = withDefaults(defineProps<Props>(), {
  gradientColors: () => ["#A97CF8", "#F38CB8", "#FDCC92"],
  minScratchPercentage: 50,
});

const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLDivElement>();
const context = ref<CanvasRenderingContext2D>();
const isScratching = ref(false);
const isComplete = ref(false);

const emit = defineEmits<{
  complete: [];
}>();

function handleMouseDown() {
  isScratching.value = true;
}
function handleTouchStart() {
  isScratching.value = true;
}

function getCanvasSize() {
  if (!containerRef.value) return { width: 300, height: 150 };
  return {
    width: containerRef.value.clientWidth,
    height: containerRef.value.clientHeight,
  };
}

function drawCanvas() {
  if (!canvasRef.value) return;
  const { width, height } = getCanvasSize();
  canvasRef.value.width = width;
  canvasRef.value.height = height;

  context.value = canvasRef.value.getContext("2d")!;
  const gradient = context.value.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, props.gradientColors[0]);
  gradient.addColorStop(0.5, props.gradientColors[1]);
  gradient.addColorStop(1, props.gradientColors[2]);
  context.value.fillStyle = gradient;
  context.value.fillRect(0, 0, width, height);
}

function scratch(clientX: number, clientY: number) {
  if (!canvasRef.value || !context.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  context.value.globalCompositeOperation = "destination-out";
  context.value.beginPath();
  context.value.arc(x, y, 30, 0, Math.PI * 2);
  context.value.fill();
}

function handleMove(event: MouseEvent | TouchEvent) {
  if (!isScratching.value) return;
  if ("touches" in event) scratch(event.touches[0].clientX, event.touches[0].clientY);
  else scratch(event.clientX, event.clientY);
}

function handleEnd() {
  isScratching.value = false;
  checkCompletion();
}

function addEventListeners() {
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleEnd);
  document.addEventListener("touchmove", handleMove);
  document.addEventListener("touchend", handleEnd);
  document.addEventListener("touchcancel", handleEnd);
}
function removeEventListeners() {
  document.removeEventListener("mousemove", handleMove);
  document.removeEventListener("mouseup", handleEnd);
  document.removeEventListener("touchmove", handleMove);
  document.removeEventListener("touchend", handleEnd);
  document.removeEventListener("touchcancel", handleEnd);
}

function checkCompletion() {
  if (isComplete.value || !canvasRef.value || !context.value) return;

  const { width, height } = getCanvasSize();
  const imageData = context.value.getImageData(0, 0, width, height);
  const pixels = imageData.data;
  const totalPixels = pixels.length / 4;
  let clearPixels = 0;

  for (let i = 3; i < pixels.length; i += 4) if (pixels[i] === 0) clearPixels++;

  const percentage = (clearPixels / totalPixels) * 100;
  if (percentage >= props.minScratchPercentage!) {
    isComplete.value = true;
    context.value.clearRect(0, 0, width, height);
    startAnimation();
  }
}

const [animateRef, animate] = useAnimate();

async function startAnimation() {
  if (!containerRef.value) return;
  animate(containerRef.value, {
    scale: 1,
    rotate: [0, 10, -10, 10, -10, 0],
  });
  emit("complete");
}

onMounted(() => {
  drawCanvas();
  addEventListeners();

  // 自动适应父容器变化
  if (containerRef.value) {
    const ro = new ResizeObserver(drawCanvas);
    ro.observe(containerRef.value);
  }
});

onUnmounted(() => {
  removeEventListeners();
});
</script>
