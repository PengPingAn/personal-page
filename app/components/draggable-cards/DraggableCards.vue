<template>
  <div
    class="perspective-container relative flex min-h-screen w-full items-center justify-center overflow-clip"
  >
    <p
      class="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-800 md:text-4xl px-4"
    >
      If its your first day at Fight Club, you have to fight.
    </p>

    <div
      v-for="(card, index) in cards"
      :key="index"
      ref="cardRefs"
      class="draggable-card absolute min-h-96 w-80 overflow-hidden rounded-md bg-neutral-900 p-6 shadow-2xl"
      :style="card.style"
      @mousedown="dragStart($event, index)"
      @mousemove="tilt($event, index)"
      @mouseleave="resetTilt(index)"
      @touchstart="dragStart($event, index)"
    >
      <img
        :src="card.img"
        :alt="card.title"
        class="relative z-10 h-80 w-80 object-cover"
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

const cards = reactive([
  {
    title: "Tyler Durden",
    img:
      "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: -5,
    x: 0,
    y: 0,
    style: {
      top: "2.5rem",
      left: "20%",
      transform: "rotate(-5deg)",
    },
  },
  {
    title: "The Narrator",
    img:
      "https://images.unsplash.com/photo-1697909623564-3dae17f6c20b?q=80&w=2667&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: -7,
    x: 0,
    y: 0,
    style: {
      top: "10rem",
      left: "25%",
      transform: "rotate(-7deg)",
    },
  },
  {
    title: "Iceland",
    img:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2600&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: 8,
    x: 0,
    y: 0,
    style: {
      top: "1.25rem",
      left: "40%",
      transform: "rotate(8deg)",
    },
  },
  {
    title: "Japan",
    img:
      "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=3648&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: 10,
    x: 0,
    y: 0,
    style: {
      top: "8rem",
      left: "55%",
      transform: "rotate(10deg)",
    },
  },
  {
    title: "Norway",
    img:
      "https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: 2,
    x: 0,
    y: 0,
    style: {
      top: "5rem",
      right: "35%",
      transform: "rotate(2deg)",
    },
  },
  {
    title: "New Zealand",
    img:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=3070&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: -7,
    x: 0,
    y: 0,
    style: {
      top: "6rem",
      left: "45%",
      transform: "rotate(-7deg)",
    },
  },
  {
    title: "Canada",
    img:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3",
    initialRotation: 4,
    x: 0,
    y: 0,
    style: {
      top: "2rem",
      left: "30%",
      transform: "rotate(4deg)",
    },
  },
]);

const cardRefs = ref([]);
const draggingIndex = ref(null);
let initialX = 0;
let initialY = 0;

function dragStart(e, index) {
  draggingIndex.value = index;
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

  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.initialRotation}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  const glare = cardRefs.value[index].querySelector(".glare");
  if (glare) glare.style.opacity = glareOpacity;
}

function resetTilt(index) {
  if (draggingIndex.value === index) return;
  const card = cards[index];
  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.initialRotation}deg) rotateX(0deg) rotateY(0deg) scale(1)`;
  const glare = cardRefs.value[index].querySelector(".glare");
  if (glare) glare.style.opacity = 0;
}

function updateCardStyle(card) {
  card.style.transition = "none";
  card.style.transform = `translate(${card.x}px, ${card.y}px) rotate(${card.initialRotation}deg)`;
}

onMounted(() => {
  cardRefs.value = cardRefs.value.slice(0, cards.length);
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
}
.draggable-card:active {
  cursor: grabbing;
}
.draggable-card img {
  pointer-events: none;
  user-select: none;
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
