<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

type Tab = {
  title: string;
  value: string;
  content: string | HTMLElement | any;
};

const tabs: Tab[] = [
  {
    title: "Product",
    value: "product",
    content: "Product Tab",
  },
  {
    title: "Services",
    value: "services",
    content: "Services Tab",
  },
  {
    title: "Playground",
    value: "playground",
    content: "Playground Tab",
  },
  {
    title: "Content",
    value: "content",
    content: "Content Tab",
  },
  {
    title: "Random",
    value: "random",
    content: "Random Tab",
  },
];

const activeIndex = ref(0);
const hovering = ref(false);

const setActive = (index: number) => {
  activeIndex.value = index;
};

const tabClasses = (index: number) => {
  return [
    "relative px-6 py-2 rounded-full cursor-pointer select-none transition-all",
    index === activeIndex.value ? "bg-gray-200 text-black" : "bg-gray-800 text-white",
  ].join(" ");
};

const contentStyle = (index: number) => {
  const offset = index - activeIndex.value;
  return {
    zIndex: tabs.length - Math.abs(offset),
    opacity: offset > 2 || offset < -2 ? 0 : 1 - Math.abs(offset) * 0.1,
    transform: `translateY(${
      hovering.value ? offset * -50 : offset === 0 ? 0 : offset * -50
    }px) scale(${1 - Math.abs(offset) * 0.1})`,
    transition: "all 0.5s",
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
    background: "linear-gradient(to bottom right, #7c3aed, #8b5cf6)",
    padding: "2rem",
    boxSizing: "border-box",
    fontWeight: "bold",
    color: "#fff",
    overflow: "hidden",
  };
};
</script>

<template>
  <div class="w-full flex flex-col items-start gap-12">
    <!-- Tabs -->
    <div
      class="flex flex-row gap-4 overflow-x-auto max-w-full perspective-[1000px] w-full justify-center"
    >
      <div
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :class="tabClasses(index)"
        @click="setActive(index)"
        @mouseenter="hovering = true"
        @mouseleave="hovering = false"
      >
        {{ tab.title }}
      </div>
    </div>

    <!-- Content -->
    <div class="relative w-full h-[40rem] mt-8 perspective-[1000px]">
      <div v-for="(tab, index) in tabs" :key="tab.value" :style="contentStyle(index)">
        <p class="text-2xl md:text-4xl font-bold mb-4">{{ tab.content }}</p>
        <img
          src="https://ui.aceternity.com/linear.webp"
          alt="dummy"
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[90%] h-[70%] object-cover rounded-xl"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-\[1000px\] {
  perspective: 1000px;
}
</style>
