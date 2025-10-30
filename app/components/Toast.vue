<template>
  <div class="toast-container">
    <transition-group name="toast-fade" tag="div">
      <div v-for="toast in toasts" :key="toast.id" class="toast">
        <!-- 根据类型渲染对应图标 -->
        <span
          :class="{
            'gg--success': toast.type === 'success',
            'gg--error': toast.type === 'error',
            'gg--info': toast.type === 'info',
            'gg--warning': toast.type === 'warning',
          }"
        ></span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import useToastComposable from "~/composables/useToast";

const { toasts } = useToastComposable();
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 每条 toast 堆叠间距 */
.toast {
  margin-top: 12px;
  max-width: 320px;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: #fff; /* 默认白色背景 */
  color: #333;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  text-align: left;
  word-break: break-word;
  animation: slide-in 0.3s ease-out;
}

/* 图标统一样式 */
.toast span[class^="gg--"] {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/* 过渡动画 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gg--success {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Cpath fill='%230fca00' d='M18 2a16 16 0 1 0 16 16A16 16 0 0 0 18 2m0 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14' class='clr-i-outline clr-i-outline-path-1' stroke-width='1' stroke='%230fca00'/%3E%3Cpath fill='%230fca00' d='M28 12.1a1 1 0 0 0-1.41 0l-11.1 11.05l-6-6A1 1 0 0 0 8 18.53L15.49 26L28 13.52a1 1 0 0 0 0-1.42' class='clr-i-outline clr-i-outline-path-2' stroke-width='1' stroke='%230fca00'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
}
.gg--error {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23ca001a' fill-rule='evenodd' d='M8.6 1c1.6.1 3.1.9 4.2 2c1.3 1.4 2 3.1 2 5.1c0 1.6-.6 3.1-1.6 4.4c-1 1.2-2.4 2.1-4 2.4s-3.2.1-4.6-.7s-2.5-2-3.1-3.5S.8 7.5 1.3 6c.5-1.6 1.4-2.9 2.8-3.8C5.4 1.3 7 .9 8.6 1m.5 12.9c1.3-.3 2.5-1 3.4-2.1c.8-1.1 1.3-2.4 1.2-3.8c0-1.6-.6-3.2-1.7-4.3c-1-1-2.2-1.6-3.6-1.7c-1.3-.1-2.7.2-3.8 1S2.7 4.9 2.3 6.3c-.4 1.3-.4 2.7.2 4q.9 1.95 2.7 3c1.2.7 2.6.9 3.9.6M7.9 7.5L10.3 5l.7.7l-2.4 2.5l2.4 2.5l-.7.7l-2.4-2.5l-2.4 2.5l-.7-.7l2.4-2.5l-2.4-2.5l.7-.7z' clip-rule='evenodd' stroke-width='0.5' stroke='%23ca001a'/%3E%3C/svg%3E");
}
.gg--warning {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e5af2c' d='M20.25 5c-2.663 0-5.258-.943-7.8-2.85a.75.75 0 0 0-.9 0C9.008 4.057 6.413 5 3.75 5a.75.75 0 0 0-.75.75V11c0 5.001 2.958 8.676 8.725 10.948a.75.75 0 0 0 .55 0C18.042 19.676 21 16 21 11V5.75a.75.75 0 0 0-.75-.75M4.5 6.478c2.577-.152 5.08-1.09 7.5-2.8c2.42 1.71 4.923 2.648 7.5 2.8V11c0 4.256-2.453 7.379-7.5 9.442C6.953 18.379 4.5 15.256 4.5 11zm8.243 1.174a.75.75 0 0 0-1.493.102v6.498l.007.102a.75.75 0 0 0 1.493-.102V7.754zM12 18a1 1 0 1 0 0-2a1 1 0 0 0 0 2' stroke-width='0.5' stroke='%23e5af2c'/%3E%3C/svg%3E");
}
.gg--info {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%232ca0e5' stroke-width='0.5' stroke='%232ca0e5'%3E%3Cpath d='M11 10.98a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0zm1-4.929a1 1 0 1 0 0 2a1 1 0 0 0 0-2'/%3E%3Cpath fill-rule='evenodd' d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2M4 12a8 8 0 1 0 16 0a8 8 0 0 0-16 0' clip-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
