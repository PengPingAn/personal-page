import { defineNuxtPlugin } from "#app";
import useToastComposable from "~/composables/useToast";

export default defineNuxtPlugin(() => {
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

  if (typeof window !== "undefined") {
    // 挂在全局
    window.toast = toast;
    // 或者 globalThis.toast = toast;
  }
});
