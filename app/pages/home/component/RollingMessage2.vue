<template>
  <div class="rolling-outer">
    <!-- 可视窗口：我们控制它的 scrollTop -->
    <div
      class="rolling-viewport"
      ref="viewportRef"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <!-- 内容容器：放两倍或多倍的列表以实现无缝循环 -->
      <div class="rolling-content" ref="contentRef">
        <div v-for="(item, idx) in renderedList" :key="idx" class="rolling-item">
          <img :src="item.headUrl" class="avatar" alt="avatar" />
          <div class="text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, defineProps } from "vue";

interface Message {
  nickName?: string;
  email?: string;
  content: string;
  createTime?: string;
  ip?: string;
  headUrl?: string;
}

const props = defineProps<{
  // 每秒滚动像素 (px/s)，越大越快。默认 40 px/s
  speed?: number;
  // 最少条数占位（当接口返回为空或太少时的默认占位）
  minPlaceholders?: number;
}>();

const speed = props.speed ?? 40;
const minPlaceholders = props.minPlaceholders ?? 6;

const viewportRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const rawList = ref<Message[]>([]); // 原始从接口拿到的列表
const renderedList = ref<Message[]>([]); // 用于渲染的重复列表（可能多次重复）

let rafId: number | null = null;
let lastTime = 0;
let paused = false;

// 获取消息（外部可通过 ref 调用）
const getMessage = async () => {
  try {
    const res = await $request.Get("/home/get_message_list");
    if (res && res.code === 200 && Array.isArray(res.data)) {
      rawList.value = res.data.map((it: any) => ({
        headUrl: it.headUrl || it.avatar || "",
        content: it.content ?? "",
        nickName: it.nickName ?? "",
        email: it.email ?? "",
        createTime: it.createTime ?? "",
        ip: it.ip ?? "",
      }));
    } else {
      // 如果接口返回不对，保持占位
      rawList.value = [];
    }
  } catch (e) {
    console.error("getMessage error:", e);
    rawList.value = [];
  }

  await nextTick();
  buildRenderedList();
  startLoop(); // 重新启动并自适应
};

const buildRenderedList = () => {
  // 如果没有数据：生成占位
  if (!rawList.value.length) {
    const placeholders = Array.from({ length: minPlaceholders }).map((_, i) => ({
      headUrl: `https://i.pravatar.cc/40?img=${i + 1}`,
      content: "暂无留言",
    }));
    renderedList.value = [...placeholders, ...placeholders];
    return;
  }

  // 基本双倍
  let list = [...rawList.value, ...rawList.value];

  // 确认内容高度 > 可视高度；如果不足，继续重复直到足够
  if (viewportRef.value && contentRef.value) {
    const vp = viewportRef.value;
    // Temporarily set renderedList to list to let DOM calculate
    renderedList.value = list;
    // we will wait a tick in caller to measure; but here, return early and let caller measure via ensureEnoughContent
  } else {
    renderedList.value = list;
  }
};

// 确认内容高度足够，不会出现空白
const ensureEnoughContent = () => {
  const vp = viewportRef.value;
  const content = contentRef.value;
  if (!vp || !content) return;

  const vpH = vp.clientHeight;
  let contentH = content.scrollHeight;

  // If content height <= viewport height (or too small), keep repeating list
  if (contentH <= vpH * 1.1) {
    // 计算需要重复多少倍（至少 2 倍）
    const base = rawList.value.length || minPlaceholders;
    // 每次 render 列表长度为 base * k
    let k = 2;
    let newList = [];
    while (true) {
      newList = Array.from({ length: k }).flatMap(() =>
        rawList.value.length
          ? rawList.value
          : Array.from({ length: minPlaceholders }).map((_, i) => ({
              headUrl: `https://i.pravatar.cc/40?img=${i + 1}`,
              content: "暂无留言",
            }))
      );
      // duplicate for seamless -> double
      const doubled = [...newList, ...newList];
      renderedList.value = doubled;
      // nextTick to measure
      // measure after DOM update
      // break condition below after measurement in caller (we'll call ensureEnoughContent after nextTick)
      break;
    }
  } else {
    // 内容已经足够，确保是基本双倍（用于无缝）
    if (renderedList.value.length < rawList.value.length * 2) {
      renderedList.value = [...rawList.value, ...rawList.value];
    }
  }
};

// RAF 滚动循环
const step = (timestamp: number) => {
  if (!viewportRef.value || !contentRef.value) {
    lastTime = timestamp;
    rafId = requestAnimationFrame(step);
    return;
  }
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000; // seconds
  lastTime = timestamp;

  if (!paused) {
    const vp = viewportRef.value;
    const content = contentRef.value;

    // scroll by pixels
    const delta = speed * dt; // px to move this frame
    vp.scrollTop = vp.scrollTop + delta;

    // loop logic: when we've scrolled past half of content (the duplicated region), reset
    const half = content.scrollHeight / 2;
    if (vp.scrollTop >= half) {
      // subtract half to loop seamlessly
      vp.scrollTop = vp.scrollTop - half;
    }
  }

  rafId = requestAnimationFrame(step);
};

const startLoop = async () => {
  stopLoop();
  await nextTick();
  // ensure enough content after DOM updated
  ensureEnoughContent();
  await nextTick();
  // reset scrollTop to a small value so loop starts cleanly
  if (viewportRef.value) viewportRef.value.scrollTop = 0;
  lastTime = 0;
  rafId = requestAnimationFrame(step);
};

const stopLoop = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

// 鼠标事件（平滑暂停）
const onMouseEnter = () => {
  paused = true;
};
const onMouseLeave = () => {
  paused = false;
};

// 外部可调用
defineExpose({
  getMessage,
  startLoop,
  stopLoop,
  pause: () => (paused = true),
  resume: () => (paused = false),
});

onMounted(async () => {
  // 初始占位 + 启动
  buildRenderedList();
  await nextTick();
  ensureEnoughContent();
  startLoop();

  // 自动请求
  getMessage();

  // 监听窗口大小变化以重建内容高度
  const onResize = async () => {
    await nextTick();
    ensureEnoughContent();
  };
  window.addEventListener("resize", onResize);

  onBeforeUnmount(() => {
    window.removeEventListener("resize", onResize);
  });
});

onBeforeUnmount(() => {
  stopLoop();
});
</script>

<style scoped>
.rolling-outer {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* 视口：我们控制 scrollTop */
.rolling-viewport {
  position: absolute;
  inset: 0; /* 填满父容器 */
  overflow: hidden; /* 隐藏溢出，只显示视口 */
  box-sizing: border-box;
}

/* 实际可滚动内容（高度会超过视口） */
.rolling-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

/* 单条样式 */
.rolling-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  box-sizing: border-box;
  min-height: 2.4rem;
  border-radius: 6px;
}

/* 头像 */
.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

/* 文本 */
.text {
  font-size: 0.9rem;
  line-height: 1.3;
  color: #fff;
  word-break: break-word;
}

/* 可选：让滚动更平滑（视觉层面） */
</style>
