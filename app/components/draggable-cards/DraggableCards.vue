<template>
  <div
    class="perspective-container relative flex min-h-screen w-full items-center justify-center overflow-hidden"
    ref="containerRef"
  >
    <p
      class="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-800 md:text-4xl px-4"
    >
      Some things, once recorded, become eternal.
    </p>

    <div
      v-for="(card, index) in cards"
      :key="index"
      ref="cardRefs"
      class="draggable-card absolute overflow-hidden rounded-md bg-neutral-900 p-6 shadow-2xl"
      :style="card.style"
      @mousedown="dragStart($event, index)"
      @mousemove="tilt($event, index)"
      @mouseleave="resetTilt(index)"
      @touchstart="dragStart($event, index)"
    >
      <img
        :src="card.img"
        :alt="card.title"
        class="card-img"
        @load="card.loaded = true"
        :class="{ loaded: card.loaded }"
      />
      <h3 class="mt-4 text-center text-2xl font-bold text-neutral-300">
        {{ card.title }}
      </h3>
      <div class="glare"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick, type PropType } from "vue";

interface Photo {
  title: string;
  img: string;
}

const props = defineProps({
  photos: {
    type: Array as PropType<Photo[]>,
    default: () => [],
  },
});

const containerRef = ref<HTMLElement | null>(null);
const cardRefs = ref<HTMLElement[]>([]);
const cards = ref<any[]>([]);
const draggingIndex = ref<number | null>(null);
let initialMouseX = 0;
let initialMouseY = 0;

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// 预加载图片
function preloadImages(photos: Photo[]) {
  return Promise.all(
    photos.map(
      (p) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = p.img;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

async  function initializeCards() {
  if (!containerRef.value) return;

   await preloadImages(props.photos); // 确保图片加载完成

  const containerRect = containerRef.value.getBoundingClientRect();
  const containerWidth = containerRect.width;
  const containerHeight = containerRect.height;

  const cardWidth = 200;
  const cardHeight = 300;

  cards.value = props.photos.map((p) => {
    const rotation = getRandom(-15, 15);
    const top = getRandom(0, containerHeight - cardHeight);
    const left = getRandom(0, containerWidth - cardWidth);

    return {
      title: p.title,
      img: p.img,
      rotation,
      loaded: false,
      x: 0,
      y: 0,
      style: reactive({
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        transform: `rotate(${rotation}deg)`,
        zIndex: 10,
        transition: "none",
      }),
    };
  });

  nextTick(() => {
    cardRefs.value = cardRefs.value.slice(0, cards.value.length);
  });
}



// 拖拽逻辑
function dragStart(e: MouseEvent | TouchEvent, index: number) {
  draggingIndex.value = index;

  // 置顶点击的卡片
  const maxZ = Math.max(...cards.value.map((c) => c.style.zIndex || 0));
  cards.value[index].style.zIndex = maxZ + 1;

  const card = cards.value[index];
  const clientX = e.type.includes("touch")
    ? (e as TouchEvent).touches[0].clientX
    : (e as MouseEvent).clientX;
  const clientY = e.type.includes("touch")
    ? (e as TouchEvent).touches[0].clientY
    : (e as MouseEvent).clientY;

  initialMouseX = clientX - card.x;
  initialMouseY = clientY - card.y;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", dragEnd);
}

function drag(e: MouseEvent | TouchEvent) {
  if (draggingIndex.value === null) return;
  e.preventDefault();

  const card = cards.value[draggingIndex.value];
  const clientX = e.type.includes("touch")
    ? (e as TouchEvent).touches[0].clientX
    : (e as MouseEvent).clientX;
  const clientY = e.type.includes("touch")
    ? (e as TouchEvent).touches[0].clientY
    : (e as MouseEvent).clientY;

  card.x = clientX - initialMouseX;
  card.y = clientY - initialMouseY;

  updateCardStyle(card);
}

function dragEnd() {
  if (draggingIndex.value === null) return;
  const card = cards.value[draggingIndex.value];
  card.style.transition = "transform 0.3s cubic-bezier(0.2, 0, 0, 1)";
  updateCardStyle(card);
  draggingIndex.value = null;

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", dragEnd);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", dragEnd);
}

// tilt 悬浮
function tilt(e: MouseEvent, index: number) {
  if (draggingIndex.value === index) return;
  const card = cards.value[index];
  const rect = cardRefs.value[index].getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;

  const rotateY = (deltaX / rect.width) * 15;
  const rotateX = -(deltaY / rect.height) * 15;
  const glareOpacity = Math.min(Math.abs(deltaX / rect.width) * 0.2, 0.2);

  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

  const glare = cardRefs.value[index].querySelector(".glare") as HTMLElement;
  if (glare) glare.style.opacity = glareOpacity.toString();
}

function resetTilt(index: number) {
  const card = cards.value[index];
  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`;
  const glare = cardRefs.value[index].querySelector(".glare") as HTMLElement;
  if (glare) glare.style.opacity = "0";
}

function updateCardStyle(card: any) {
  card.style.transition = "none";
  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.rotation}deg)`;
}

// SSR 安全初始化
onMounted(() => {
  initializeCards();
});

// 支持异步更新 props.photos
watch(
  () => props.photos,
  (newPhotos) => {
    if (newPhotos && newPhotos.length) {
      initializeCards();
    }
  }
);
</script>

<style scoped>
.perspective-container {
  perspective: 3000px;
}

.draggable-card {
  cursor: grab;
  user-select: none;
  touch-action: none;
  will-change: transform;
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.draggable-card:active {
  cursor: grabbing;
}

.card-img {
  pointer-events: none;
  user-select: none;
  display: block;
  max-width: 320px;
  max-height: 320px;
  width: auto;
  height: auto;
  margin: 0 auto;
  object-fit: contain;
}

.glare {
  pointer-events: none;
  user-select: none;
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  transition: opacity 0.1s ease-out;
}

.card-img {
  filter: blur(20px);
  transition: filter 0.3s ease;
}
.card-img.loaded {
  filter: blur(0);
}
</style>
