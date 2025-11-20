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
                  :class="{ flex: item?.link }"
                >
                  <template
                    v-for="part in splitText(item)"
                    :key="activeIndex + '-' + idx + '-' + part.text"
                  >
                    <PointerHighlight
                      v-if="part.isHighlight"
                      :containerClassName="'my-pointer'"
                    >
                      <span
                        class="text-lg font-bold inline whitespace-pre-wrap break-words"
                      >
                        {{ part.text }}
                      </span>
                    </PointerHighlight>
                    <HoverLink
                      v-else-if="part.isLink"
                      :href="part.text"
                      :text="part.text"
                      color="#74fa85"
                      class="inline"
                    />

                    <span
                      v-else
                      class="text-lg font-bold inline whitespace-pre-wrap break-words"
                    >
                      {{ part.text }}
                    </span>
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

          <!-- 右侧轮播区域保持不变 -->
          <div
            class="w-[55%] h-full relative flex flex-col items-center justify-start justify-center"
          >
            <div
              class="relative w-full h-[70%] overflow-hidden flex items-center justify-center"
              @mouseenter="hovering = true"
              @mouseleave="hovering = false"
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

    <ImageZoom :showThumb="false" ref="imageZoomRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import ImageZoom from "@/components/ImageZoom.vue";

type ContentItem = {
  type: "text" | "inline" | "highlight" | "h3" | "link";
  text: string;
  highlight?: string[];
  link?: string[];
};

type Tab = {
  title: string;
  value: string;
  content: ContentItem[];
  images: string[];
};

const props = defineProps<{ projectsData?: Tab[] }>();
const tabs = ref<Tab[]>(props.projectsData ?? []);

const activeIndex = ref(0);
const hovering = ref(false);
const slideIndexes = ref<number[]>(tabs.value.length ? tabs.value.map(() => 0) : []);

// ----------- 核心：拆分 text => 高亮 + 链接 -----------
const splitText = (item: ContentItem) => {
  const result: { text: string; isHighlight?: boolean; isLink?: boolean }[] = [];
  const highlights = item.highlight ?? [];
  const links = item.link ?? [];
  if (!highlights.length && !links.length) return [{ text: item.text }];

  let str = item.text;
  const parts: { text: string; type: "highlight" | "link" | "text" }[] = [];

  // 合并匹配索引
  const matches: { index: number; length: number; type: "highlight" | "link" }[] = [];
  highlights.forEach((h) => {
    let start = 0;
    while ((start = str.indexOf(h, start)) !== -1) {
      matches.push({ index: start, length: h.length, type: "highlight" });
      start += h.length;
    }
  });
  links.forEach((l) => {
    let start = 0;
    while ((start = str.indexOf(l, start)) !== -1) {
      matches.push({ index: start, length: l.length, type: "link" });
      start += l.length;
    }
  });

  matches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;
  matches.forEach((m) => {
    if (m.index > lastIndex) {
      result.push({ text: str.slice(lastIndex, m.index) });
    }
    result.push({
      text: str.slice(m.index, m.index + m.length),
      isHighlight: m.type === "highlight",
      isLink: m.type === "link",
    });
    lastIndex = m.index + m.length;
  });
  if (lastIndex < str.length) result.push({ text: str.slice(lastIndex) });

  return result;
};

// ---------- 其他逻辑保持不变 ----------
const setActive = async (index: number) => {
  if (index === activeIndex.value) return;
  const prevIndex = activeIndex.value;
  const prevSlideIndex = slideIndexes.value[prevIndex] ?? 0;
  slideIndexes.value[index] = prevSlideIndex;
  activeIndex.value = index;
  await nextTick();
  slideIndexes.value[index] = 0;
};
const getTabTotal = (tabIndex: number) => tabs.value[tabIndex]?.images?.length ?? 0;
const nextSlide = (tabIndex: number) => {
  const total = getTabTotal(tabIndex);
  if (total === 0) return;
  slideIndexes.value[tabIndex] =
    (slideIndexes.value[tabIndex] ?? 0) < total - 1
      ? (slideIndexes.value[tabIndex] ?? 0) + 1
      : 0;

  // 点击手动切换时重置自动轮播
  stopAuto();
  startAuto();
};
const prevSlide = (tabIndex: number) => {
  const total = getTabTotal(tabIndex);
  if (total === 0) return;
  slideIndexes.value[tabIndex] =
    (slideIndexes.value[tabIndex] ?? 0) > 0
      ? (slideIndexes.value[tabIndex] ?? 0) - 1
      : total - 1;

  // 点击手动切换时重置自动轮播
  stopAuto();
  startAuto();
};

let timer: any;
const startAuto = () => {
  stopAuto();
  timer = setInterval(() => {
    if (!hovering.value && tabs.value.length) nextSlide(activeIndex.value);
  }, 4000);
};
const stopAuto = () => clearInterval(timer);
onMounted(startAuto);
onUnmounted(stopAuto);
watch(hovering, (val) => (val ? stopAuto() : startAuto()));
watch(
  () => props.projectsData,
  (newVal) => {
    tabs.value = newVal ?? [];
    slideIndexes.value = tabs.value.map(() => 0);
  },
  { immediate: true }
);

const tabClasses = (index: number) =>
  [
    "relative px-6 py-2 rounded-full cursor-pointer select-none transition-all",
    index === activeIndex.value ? "bg-gray-200 text-black" : "bg-gray-800 text-white",
  ].join(" ");
const contentStyle = (index: number) => {
  const offset = index - activeIndex.value;
  return {
    zIndex: tabs.value.length - Math.abs(offset),
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

const getTransform = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex] ?? 0;
  const total = getTabTotal(tabIndex);
  if (total === 0) return "";
  if (imgIndex === current) return "translateX(0%) scale(1)";
  if (imgIndex === current + 1 && current < total - 1)
    return "translateX(90%) scale(0.9)";
  if (current === total - 1 && imgIndex === current - 1)
    return "translateX(-90%) scale(0.9)";
  return "translateX(200%) scale(0.8)";
};
const getZIndex = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex] ?? 0;
  const total = getTabTotal(tabIndex);
  if (total === 0) return 0;
  if (imgIndex === current) return 30;
  if (
    (imgIndex === current + 1 && current < total - 1) ||
    (current === total - 1 && imgIndex === current - 1)
  )
    return 20;
  return 0;
};
const getOpacity = (tabIndex: number, imgIndex: number) => {
  const current = slideIndexes.value[tabIndex] ?? 0;
  const total = getTabTotal(tabIndex);
  if (total === 0) return 0;
  if (imgIndex === current) return 1;
  if (
    (imgIndex === current + 1 && current < total - 1) ||
    (current === total - 1 && imgIndex === current - 1)
  )
    return 1;
  return 0;
};

const imageZoomRef = ref<InstanceType<typeof ImageZoom> | null>(null);
const openImageZoom = (images: string[], index: number) => {
  if (!images || images.length === 0) return;
  imageZoomRef.value?.setImages(images);
  imageZoomRef.value?.openZoomAt(index);
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

.container {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
