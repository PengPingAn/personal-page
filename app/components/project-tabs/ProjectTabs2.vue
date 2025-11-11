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
      <div
        v-for="(tab, index) in tabs"
        :key="tab.value"
        :style="contentStyle(index)"
        class="container"
      >
        <div class="flex flex-row w-full h-full gap-8">
          <!-- 左侧文字区域 -->
          <div
            class="w-[40%] h-full overflow-y-auto pr-4 scrollbar-hide flex flex-col gap-2 custom-scrollbar"
          >
            <template v-for="(item, idx) in tab.content" :key="idx">
              <template v-if="item.type === 'text'">
                <span
                  class="text-lg font-bold text-white whitespace-pre-wrap break-words"
                >
                  {{ item.text }}
                  <template
                    v-if="
                      tab.content[idx + 1]?.type === 'inline' ||
                      tab.content[idx + 1]?.type === 'link' ||
                      tab.content[idx + 1]?.type === 'highlight'
                    "
                  >
                    <span
                      class="inline ml-1"
                      v-if="tab.content[idx + 1].type === 'inline'"
                    >
                      {{ tab.content[idx + 1].text }}
                    </span>
                    <HoverLink
                      v-else-if="tab.content[idx + 1].type === 'link'"
                      :href="tab.content[idx + 1].text"
                      :text="tab.content[idx + 1].text"
                      color="#74fa85"
                      class="inline ml-1"
                    />
                    <PointerHighlight
                      v-else-if="tab.content[idx + 1].type === 'highlight'"
                      :key="activeIndex + '-' + idx"
                      :containerClassName="'my-pointer'"
                    >
                      <span
                        class="text-lg font-bold block whitespace-pre-wrap break-words"
                      >
                        {{ tab.content[idx + 1].text }}
                      </span>
                    </PointerHighlight>
                  </template>
                </span>
              </template>

              <h3
                v-else-if="item.type === 'h3'"
                class="text-2xl md:text-3xl font-semibold mt-4 mb-2 text-white"
              >
                {{ item.text }}
              </h3>
            </template>
          </div>

          <!-- 右侧轮播 -->
          <div
            class="w-[55%] h-full relative flex flex-col items-center justify-start justify-center"
            @mouseenter="hovering = true"
            @mouseleave="hovering = false"
          >
            <!-- 轮播图片区域 -->
            <div
              class="relative w-full h-[70%] overflow-hidden flex items-center justify-center"
            >
              <div
                v-for="(img, imgIndex) in tab.images"
                :key="img"
                class="absolute transition-slide rounded-3xl shadow-lg"
                :style="{
                  width: '90%',
                  height: '100%',
                  transform: getTransform(index, imgIndex),
                  zIndex: getZIndex(index, imgIndex),
                  opacity: getOpacity(index, imgIndex),
                }"
              >
                <img
                  :src="img"
                  class="w-full h-full object-cover rounded-3xl cursor-zoom-in bg-black"
                  draggable="false"
                  @click="openImageZoom(tab.images, imgIndex)"
                />
              </div>
            </div>

            <!-- 小圆点 + 按钮容器 -->
            <div class="mt-4 w-full flex justify-between items-center px-4">
              <div class="flex gap-2 justify-center flex-1">
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
              <div class="flex gap-2">
                <button
                  class="bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                  @click="prevSlide(index)"
                >
                  ‹
                </button>
                <button
                  class="bg-white/30 hover:bg-white/50 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
                  @click="nextSlide(index)"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全局 ImageZoom 组件 -->
    <ImageZoom :showThumb="false" ref="imageZoomRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { Motion } from "motion-v";
import ImageZoom from "@/components/ImageZoom.vue";

type ContentItem = {
  type: "text" | "inline" | "highlight" | "h3" | "link";
  text: string;
};

type Tab = {
  title: string;
  value: string;
  content: ContentItem[];
  images: string[];
};

const tabs: Tab[] = [
  {
    title: "爱语",
    value: "爱语",
    content: [
      { type: "h3", text: "爱语情侣日记" },
      { type: "h3", text: "作品介绍" },
      {
        type: "text",
        text: `这是一个专为情侣打造的私密空间网站，承载了技术与情感的融合，记录彼此的回忆，`,
      },
      { type: "highlight", text: "分享专属的浪漫时刻。" },
      { type: "h3", text: "技术栈" },
      {
        type: "text",
        text: `前端：vue3、Pinia、Tailwind CSS、Axios、Naive UI、Markdown\n后端：.NET 8 Web API、SqlSugar、SQLite、Redis、WebSocket、Swagger`,
      },
      { type: "h3", text: "链接" },
      { type: "text", text: "Gitee：" },
      { type: "link", text: "https://gitee.com/leefugui/love-word" },
      { type: "text", text: "Demo：" },
      { type: "link", text: "https://gitee.com/leefugui/love-word" },
      { type: "text", text: "GitHub：" },
      { type: "link", text: "https://gitee.com/leefugui/love-word" },
    ],
    images: [
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637973_02b813c6.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637978_445146f6.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637930_10d5d698.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637977_21d3d117.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637934_9f73266f.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637975_425afe68.png",
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761637935_71f6ff4c.png",
    ],
  },
  {
    title: "Services",
    value: "services",
    content: [
      { type: "h3", text: "Services Tab" },
      { type: "text", text: "Check out our " },
      { type: "highlight", text: "awesome services" },
    ],
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
  stopAuto();
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

// Content 样式
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

// ---------------------- ImageZoom 调用 ----------------------
const imageZoomRef = ref<InstanceType<typeof ImageZoom> | null>(null);

// 点击轮播图某张图片，打开 ImageZoom
const openImageZoom = (images: string[], index: number) => {
  if (imageZoomRef.value) {
    imageZoomRef.value.setImages(images);
    imageZoomRef.value.openZoomAt(index);
  }
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
/* 隐藏滚动条 */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* From Uiverse.io by adamgiebl */
.container {
  width: 100%;
  height: 100%;
  --color: rgba(114, 114, 114, 0.3);
  /* background-color: #191a1a;
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      var(--color) 25%,
      var(--color) 26%,
      transparent 27%,
      transparent 74%,
      var(--color) 75%,
      var(--color) 76%,
      transparent 77%,
      transparent
    );
  background-size: 55px 55px; */

  backdrop-filter: blur(15px); /* 毛玻璃模糊 */
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.1); /* 半透明背景 */
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
