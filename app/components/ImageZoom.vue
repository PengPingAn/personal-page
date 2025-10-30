<template>
  <div class="inline-block">
    <!-- 缩略图 -->
    <div
      v-if="showThumb"
      class="relative cursor-zoom-in rounded-lg overflow-hidden"
      @click="openZoom"
    >
      <img :src="currentImage" :alt="alt" class="block w-full h-auto" />
      <div
        class="absolute top-2 right-2 bg-black bg-opacity-50 w-9 h-9 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3S3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
          />
        </svg>
      </div>
    </div>

    <!-- 放大模态框 -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- 背景层 -->
        <!-- 背景层：固定不动 -->
        <div class="absolute inset-0 bg-black bg-opacity-90 z-0" @click="closeZoom"></div>

        <!-- 图片层：动画切换 -->
        <transition :name="slideDirection" mode="out-in">
          <div :key="currentIndex" @click.stop class="flex justify-center">
            <img
              :src="currentImage"
              :alt="alt"
              ref="zoomedImage"
              :style="innerStyle"
              class="max-w-[80vw] block cursor-grab"
              draggable="false"
              @mousedown="startDrag"
              @mousemove="onDrag"
              @mouseup="endDrag"
              @mouseleave="endDrag"
              @wheel.prevent="onWheel"
              @click.stop
            />
          </div>
        </transition>

        <!-- 关闭按钮 -->
        <button
          class="absolute top-5 right-5 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition z-20"
          @click="closeZoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- 左右导航按钮（永远显示） -->
        <button
          class="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition z-20"
          @click.stop="prevImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          class="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-40 transition z-20"
          @click.stop="nextImage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <!-- 缩放控制 -->
        <div
          class="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 bg-white bg-opacity-20 rounded-full p-2 backdrop-blur z-20"
        >
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-30 transition"
            @click="zoomOut"
            :disabled="scale <= minScale"
          >
            <span class="text-white text-xl">−</span>
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-30 transition"
            @click="resetZoom"
          >
            <span class="text-white text-xl">↺</span>
          </button>
          <button
            class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-30 transition"
            @click="zoomIn"
            :disabled="scale >= maxScale"
          >
            <span class="text-white text-xl">+</span>
          </button>
        </div>

        <!-- 缩放百分比 -->
        <div
          class="absolute bottom-5 right-5 bg-white bg-opacity-20 rounded-full px-3 py-1 text-white text-sm z-20"
        >
          {{ Math.round(scale * 100) }}%
        </div>

        <!-- 图片计数 -->
        <div
          v-if="images.length > 1"
          class="absolute top-5 left-5 bg-white bg-opacity-20 rounded-full px-3 py-1 text-white text-sm z-20"
        >
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- 提示文本 -->
        <div
          v-if="showTip"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg bg-black bg-opacity-50 px-4 py-2 rounded z-30"
        >
          {{ showTip }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from "vue";

interface Props {
  src: string | string[];
  alt?: string;
  minScale?: number;
  maxScale?: number;
  zoomStep?: number;
  showThumb?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  alt: "Image",
  minScale: 0.5,
  maxScale: 5,
  zoomStep: 0.2,
  showThumb: true,
});

const isOpen = ref(false);
const scale = ref(1);
const offset = reactive({ x: 0, y: 0 });
const isDragging = ref(false);
const dragStart = reactive({ x: 0, y: 0 });

const zoomedImage = ref<HTMLImageElement | null>(null);

const currentIndex = ref(0);
const externalImages = ref<string[]>([]);

const slideDirection = ref("slide-left"); // 图片切换动画方向
const showTip = ref(""); // 提示文本

const images = computed(() =>
  externalImages.value.length
    ? externalImages.value
    : Array.isArray(props.src)
    ? props.src
    : [props.src]
);
const currentImage = computed(() => images.value[currentIndex.value]);

const innerStyle = computed(() => ({
  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale.value})`,
  transformOrigin: "center center",
  transition: isDragging.value ? "none" : "transform 0.25s ease",
  display: "block",
}));

const openZoom = async () => {
  isOpen.value = true;
  document.body.style.overflow = "hidden";
  await nextTick();
};
const closeZoom = () => {
  isOpen.value = false;
  document.body.style.overflow = "";
  resetZoom();
};
const resetZoom = () => {
  scale.value = 1;
  offset.x = 0;
  offset.y = 0;
};
const zoomIn = () => {
  if (scale.value < props.maxScale)
    scale.value = Math.min(scale.value + props.zoomStep!, props.maxScale!);
};
const zoomOut = () => {
  if (scale.value > props.minScale)
    scale.value = Math.max(scale.value - props.zoomStep!, props.minScale!);
};

const onWheel = (e: WheelEvent) => {
  const delta = e.deltaY < 0 ? 1 : -1;
  scale.value = Math.min(
    Math.max(scale.value + delta * (props.zoomStep ?? 0.2), props.minScale!),
    props.maxScale!
  );
};

const startDrag = (e: MouseEvent) => {
  if (e.button !== 0) return;
  e.preventDefault();
  isDragging.value = true;
  dragStart.x = e.clientX - offset.x;
  dragStart.y = e.clientY - offset.y;
};
const onDrag = (e: MouseEvent) => {
  if (isDragging.value) {
    offset.x = e.clientX - dragStart.x;
    offset.y = e.clientY - dragStart.y;
  }
};
const endDrag = () => {
  isDragging.value = false;
};

const prevImage = () => {
  if (currentIndex.value > 0) {
    slideDirection.value = "slide-right";
    currentIndex.value--;
    resetZoom();
  } else {
    showTip.value = "这是第一张~";
    setTimeout(() => (showTip.value = ""), 1500);
  }
};

const nextImage = () => {
  if (currentIndex.value < images.value.length - 1) {
    slideDirection.value = "slide-left";
    currentIndex.value++;
    resetZoom();
  } else {
    showTip.value = "这是最后一张了~";
    setTimeout(() => (showTip.value = ""), 1500);
  }
};

// 键盘操作
const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return;
  switch (e.key) {
    case "Escape":
      closeZoom();
      break;
    case "+":
    case "=":
      zoomIn();
      break;
    case "-":
      zoomOut();
      break;
    case "0":
      resetZoom();
      break;
    case "ArrowLeft":
      prevImage();
      break;
    case "ArrowRight":
      nextImage();
      break;
  }
};
onMounted(() => document.addEventListener("keydown", onKeydown));
onUnmounted(() => document.removeEventListener("keydown", onKeydown));

const setImages = (imgList: string[]) => {
  externalImages.value = imgList;
  currentIndex.value = 0;
};
const openZoomAt = (index: number) => {
  currentIndex.value = index;
  openZoom();
};
defineExpose({ setImages, openZoomAt });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pointer-grab {
  cursor: grab;
}
.pointer-grabbing {
  cursor: grabbing;
}

/* 图片切换动画 */
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}
</style>
