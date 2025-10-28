<template>
  <div
    class="perspective-container relative flex min-h-screen w-full items-center justify-center overflow-clip"
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
        :style="{ zIndex: card.style.zIndex }"
      />
      <h3 class="mt-4 text-center text-2xl font-bold text-neutral-300">
        {{ card.title }}
      </h3>
      <div class="glare"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

const baseCards = [
  {
    title: "Tyler Durden",
    img:
      "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "The Narrator",
    img:
      "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Iceland",
    img:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Japan",
    img:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Norway",
    img:
      "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "New Zealand",
    img:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
  {
    title: "Canada",
    img:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
  },
];

const cards = reactive([]);
const cardRefs = ref([]);
const draggingIndex = ref(null);
let initialX = 0;
let initialY = 0;

// 初始化卡片位置
function initializeCards() {
  baseCards.forEach((c) => {
    const rotation = getRandom(-15, 15);

    // 将初始位置转换为 translate 值
    const initialX = 0;
    const initialY = 0;

    const initialTransform = `translate(${initialX}px, ${initialY}px) rotate(${rotation}deg)`;

    cards.push({
      title: c.title,
      img: c.img,
      initialRotation: rotation,
      x: initialX,
      y: initialY,
      initialTop: getRandom(0, 60),
      initialLeft: getRandom(0, 60),
      style: {
        transform: initialTransform,
        zIndex: 10,
      },
      displayWidth: 0,
      displayHeight: 0,
      initialTransform: initialTransform,
    });
  });
}

initializeCards();

function dragStart(e, index) {
  draggingIndex.value = index;
  cards.forEach((c, i) => (c.style.zIndex = i === index ? 50 : 10));

  const card = cards[index];
  const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const y = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  initialX = x - card.x;
  initialY = y - card.y;
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
  document.addEventListener("touchmove", drag);
  document.addEventListener("touchend", dragEnd);
}

function drag(e) {
  if (draggingIndex.value === null) return;
  e.preventDefault();
  const card = cards[draggingIndex.value];
  const x = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
  const y = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;
  card.x = x - initialX;
  card.y = y - initialY;
  updateCardStyle(card);
}

function dragEnd() {
  if (draggingIndex.value === null) return;
  const card = cards[draggingIndex.value];
  card.style.transition = "transform 0.3s cubic-bezier(0.2, 0, 0, 1)";
  updateCardStyle(card);
  // 更新初始 transform 为当前状态
  card.initialTransform = `translate(${card.x}px, ${card.y}px) rotate(${card.initialRotation}deg)`;
  draggingIndex.value = null;
}

function tilt(e, index) {
  if (draggingIndex.value === index) return;
  const card = cards[index];
  const rect = cardRefs.value[index].getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = e.clientX - centerX;
  const deltaY = e.clientY - centerY;

  const rotateY = (deltaX / rect.width) * 25;
  const rotateX = -(deltaY / rect.height) * 25;
  const glareOpacity = Math.abs(deltaX / rect.width) * 0.2;

  // 基于初始 transform 添加悬浮效果
  card.style.transform = `${card.initialTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  const glare = cardRefs.value[index].querySelector(".glare");
  if (glare) glare.style.opacity = glareOpacity;
}

function resetTilt(index) {
  if (draggingIndex.value === index) return;
  const card = cards[index];
  // 恢复到初始 transform 状态
  card.style.transform = card.initialTransform;
  const glare = cardRefs.value[index].querySelector(".glare");
  if (glare) glare.style.opacity = 0;
}

function updateCardStyle(card) {
  card.style.transition = "none";
  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.initialRotation}deg)`;
  // 同时更新初始 transform
  card.initialTransform = card.style.transform;
}

onMounted(() => {
  cardRefs.value = cardRefs.value.slice(0, cards.length);

  // 在挂载后应用初始位置
  cards.forEach((card, index) => {
    const element = cardRefs.value[index];
    if (element) {
      // 设置初始位置
      element.style.top = `${card.initialTop}%`;
      element.style.left = `${card.initialLeft}%`;

      // 保存初始 transform
      card.initialTransform = card.style.transform;
    }
  });
});
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
  backdrop-filter: blur(15px); /* 毛玻璃模糊 */
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
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
</style>
