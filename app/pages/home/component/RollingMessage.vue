<template>
  <div class="message-wrapper">
    <div class="message-content">
      <div v-for="(item, index) in duplicatedMessages" :key="index" class="message-item">
        <img :src="item.avatar" alt="avatar" class="avatar" />
        <p class="text">{{ item.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";

interface Message {
  avatar: string;
  content: string;
}

// 组件 props，可传入留言数据和滚动速度
const props = defineProps<{
  messages: Message[];
  speed?: number; // 秒
}>();

const defaultMessages: Message[] = [
  { avatar: "https://i.pravatar.cc/40?img=1", content: "今天天气真不错！" },
  { avatar: "https://i.pravatar.cc/40?img=2", content: "这个项目太棒了👏" },
  { avatar: "https://i.pravatar.cc/40?img=3", content: "期待下个版本！" },
  { avatar: "https://i.pravatar.cc/40?img=4", content: "谢谢作者的分享～" },
  { avatar: "https://i.pravatar.cc/40?img=5", content: "已经收藏学习了！" },
  { avatar: "https://i.pravatar.cc/40?img=6", content: "Vue3 真香啊哈哈哈" },
  { avatar: "https://i.pravatar.cc/40?img=7", content: "前端越来越好玩了！" },
  { avatar: "https://i.pravatar.cc/40?img=8", content: "我也来留个言😎" },
  { avatar: "https://i.pravatar.cc/40?img=9", content: "无限滚动太丝滑了～" },
  { avatar: "https://i.pravatar.cc/40?img=10", content: "测试最后一条消息！" },
];

const msgs = props.messages?.length ? props.messages : defaultMessages;

// 克隆一份，实现无缝滚动
const duplicatedMessages = computed(() => [...msgs, ...msgs]);

// 滚动时间
const duration = props.speed ?? 20; // 默认 20 秒
</script>

<style scoped>
.message-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: #fff;
  display: flex;
  align-items: flex-end;
}

/* 滚动区域 */
.message-content {
  display: flex;
  flex-direction: column;
  animation: scroll-up linear infinite;
  animation-duration: 20s; /* 可通过 props.speed 动态设置 */
}

/* 鼠标悬浮暂停滚动 */
.message-wrapper:hover .message-content {
  animation-play-state: paused;
}

/* 单条消息 */
.message-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.text {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 无限滚动动画 */
@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
