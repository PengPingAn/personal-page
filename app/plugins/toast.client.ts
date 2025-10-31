// plugins/toast.client.ts
import { defineNuxtPlugin } from "#app";
import useToastComposable from "~/composables/useToast";

export default defineNuxtPlugin((nuxtApp) => {
  const { addToast } = useToastComposable();

  const toast = {
    success(msg: string, duration?: number) {
      addToast(msg, "success", duration);
    },
    error(msg: string, duration?: number) {
      addToast(msg, "error", duration);
    },
    info(msg: string, duration?: number) {
      addToast(msg, "info", duration);
    },
    warning(msg: string, duration?: number) {
      addToast(msg, "warning", duration);
    },
  };

  // Nuxt 全局注入
  nuxtApp.provide("toast", toast);

  // 挂到 window/globalThis，方便 Axios 拦截器使用
  if (process.client) {
    window.$toast = toast;
    globalThis.$toast = toast;
  }
});
