<template>
  <div class="message-wrapper" ref="wrapperRef">
    <!-- 添加一个内部容器 -->
    <div class="message-inner-container">
      <div
        class="message-content"
        :style="{ animationDuration: animationDuration + 's' }"
        @mouseenter="pause = true"
        @mouseleave="pause = false"
        :class="{ paused: pause }"
      >
        <div
          v-for="(item, index) in duplicatedMessages"
          :key="index"
          class="message-item"
        >
          <img :src="item.headUrl" alt="avatar" class="avatar" />
          <p class="text">{{ item.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps } from "vue";

interface Message {
  nickName: string;
  email: string;
  content: string;
  createTime: string;
  ip: string;
  headUrl: string;
}

// props
const props = defineProps<{ speed?: number }>();

const defaultMessages = ref<Message[]>([]);
const pause = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

// 克隆消息实现无缝滚动
const duplicatedMessages = computed(() => [
  ...defaultMessages.value,
  ...defaultMessages.value,
]);

// 动画时长
const animationDuration = computed(() => props.speed ?? 20);

const getMessage = async () => {
  try {
    const res = await $request.Get("/home/get_message_list");
    if (res.code === 200) {
      defaultMessages.value = res.data;
      console.log(duplicatedMessages);
    } else {
      console.error("获取文件内容失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }
};

onMounted(async () => {
  await getMessage();
});

defineExpose({
  getMessage,
});
</script>

<style scoped>
.message-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* 新增内部容器样式 */
.message-inner-container {
  height: auto; /* 不限制高度 */
  min-height: 100%; /* 至少充满容器 */
  position: relative;
}

.message-content {
  display: flex;
  flex-direction: column;
  animation-name: scroll-up;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  /* 移除可能的高度限制 */
  height: auto !important;
}

.message-content.paused {
  animation-play-state: paused;
}

.message-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  flex-shrink: 0; /* 防止消息项被压缩 */
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.text {
  font-size: 0.9rem;
  opacity: 0.9;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
