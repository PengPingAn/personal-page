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
      >
        {{ tab.title }}
      </div>
    </div>

    <!-- Content -->
    <div class="relative w-full h-[40rem] perspective-[1000px]">
      <div v-for="(tab, index) in tabs" :key="tab.value" :style="contentStyle(index)">
        <p class="text-2xl md:text-4xl font-bold mb-4">{{ tab.content }}</p>
        There has to be some
        <br />
        <!-- PointerHighlight 传入 triggerKey -->
        <PointerHighlight :key="activeIndex" :containerClassName="'my-pointer'">
          <span class="text-2xl font-bold">Hover this text</span>
        </PointerHighlight>

        <!-- 轮播整体容器 -->
        <div
          class="relative w-[90%] m-auto h-[80%] flex flex-col items-center justify-center"
          @mouseenter="hovering = true"
          @mouseleave="hovering = false"
        >
          <!-- 图片显示区域 -->
          <div
            class="relative w-[85%] h-full overflow-hidden flex items-center justify-center"
          >
            <div
              v-for="(img, imgIndex) in tab.images"
              :key="img"
              class="absolute rounded-xl shadow-lg transition-slide"
              :style="{
                width: '80%',
                height: '100%',
                transform: getTransform(index, imgIndex),
                zIndex: getZIndex(index, imgIndex),
                opacity: getOpacity(index, imgIndex),
              }"
            >
              <img
                :src="img"
                class="w-full h-full object-cover select-none rounded-2xl"
                draggable="false"
              />
            </div>
          </div>

          <!-- 左右按钮 -->
          <button
            class="absolute z-50 -translate-y-1/2 top-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
            :style="{ left: hovering ? '-20px' : '-40px' }"
            @click="prevSlide(index)"
          >
            ‹
          </button>

          <button
            class="absolute z-50 -translate-y-1/2 top-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
            :style="{ right: hovering ? '-20px' : '-40px' }"
            @click="nextSlide(index)"
          >
            ›
          </button>

          <!-- 小圆点 -->
          <div class="mt-6 flex gap-2 justify-center">
            <span
              v-for="(img, dotIndex) in tab.images"
              :key="dotIndex"
              :class="[
                slideIndexes[index] === dotIndex
                  ? 'bg-white w-8 h-2 rounded-sm'
                  : 'bg-white/50 w-2 h-2 rounded-full',
                'transition-all duration-300',
              ]"
            ></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

type Tab = {
  title: string;
  value: string;
  content: string;
  images: string[];
};

const tabs: Tab[] = [
  {
    title: "Product",
    value: "product",
    content: "Product Tab",
    images: [
      "https://picsum.photos/id/1015/1200/700",
      "https://picsum.photos/id/1016/1200/700",
      "https://picsum.photos/id/1018/1200/700",
    ],
  },
  {
    title: "Services",
    value: "services",
    content: "Services Tab",
    images: [
      "https://picsum.photos/id/1021/1200/700",
      "https://picsum.photos/id/1024/1200/700",
      "https://picsum.photos/id/1025/1200/700",
    ],
  },
];

const activeIndex = ref(0);
const hovering = ref(false);
const slideIndexes = ref<number[]>(tabs.map(() => 0));

const setActive = async (index: number) => {
  if (index === activeIndex.value) return;

  const prevIndex = activeIndex.value;
  const prevSlideIndex = slideIndexes.value[prevIndex];

  slideIndexes.value[index] = prevSlideIndex;
  activeIndex.value = index;

  await nextTick();
  slideIndexes.value[index] = 0;
};

const nextSlide = (tabIndex: number) => {
  const total = tabs[tabIndex].images.length;
  slideIndexes.value[tabIndex] =
    slideIndexes.value[tabIndex] < total - 1 ? slideIndexes.value[tabIndex] + 1 : 0;
};
const prevSlide = (tabIndex: number) => {
  const total = tabs[tabIndex].images.length;
  slideIndexes.value[tabIndex] =
    slideIndexes.value[tabIndex] > 0 ? slideIndexes.value[tabIndex] - 1 : total - 1;
};

// 自动轮播
let timer: any;
const startAuto = () => {
  timer = setInterval(() => {
    if (!hovering.value) nextSlide(activeIndex.value);
  }, 4000);
};
const stopAuto = () => clearInterval(timer);

onMounted(startAuto);
onUnmounted(stopAuto);
watch(hovering, (val) => {
  if (val) stopAuto();
  else startAuto();
});

// tab 样式
const tabClasses = (index: number) =>
  [
    "relative px-6 py-2 rounded-full cursor-pointer select-none transition-all",
    index === activeIndex.value ? "bg-gray-200 text-black" : "bg-gray-800 text-white",
  ].join(" ");

const contentStyle = (index: number) => {
  const offset = index - activeIndex.value;
  return {
    zIndex: tabs.length - Math.abs(offset),
    opacity: offset > 2 || offset < -2 ? 0 : 1 - Math.abs(offset) * 0.1,
    transform: `translateY(${offset * -50}px) scale(${1 - Math.abs(offset) * 0.1})`,
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
  };
};

// 轮播 transform
const getTransform = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex];
  const total = tabs[tabIndex].images.length;
  if (imgIndex === current) return "translateX(0%) scale(1)";
  if (imgIndex === current + 1 && current < total - 1)
    return "translateX(90%) scale(0.9)";
  if (current === total - 1 && imgIndex === current - 1)
    return "translateX(-90%) scale(0.9)";
  return "translateX(200%) scale(0.8)";
};
const getZIndex = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex];
  if (imgIndex === current) return 30;
  if (
    (imgIndex === current + 1 && current < tabs[tabIndex].images.length - 1) ||
    (current === tabs[tabIndex].images.length - 1 && imgIndex === current - 1)
  )
    return 20;
  return 0;
};
const getOpacity = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex];
  if (imgIndex === current) return 1;
  if (
    (imgIndex === current + 1 && current < tabs[tabIndex].images.length - 1) ||
    (current === tabs[tabIndex].images.length - 1 && imgIndex === current - 1)
  )
    return 1;
  return 0;
};
</script>

<style scoped>
.perspective-\[1000px\] {
  perspective: 1000px;
}
img {
  transition: transform 0.6s ease, opacity 0.6s ease;
}
.transition-slide {
  transition: transform 0.6s ease, opacity 0.6s ease;
}
button {
  font-size: 1.5rem;
  line-height: 1;
}
</style>
