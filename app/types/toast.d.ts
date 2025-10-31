import { ToastType } from "~/composables/useToast"; // 可选，如果你有 ToastType

interface ToastMethods {
  success(msg: string, duration?: number): void;
  error(msg: string, duration?: number): void;
  info(msg: string, duration?: number): void;
  warning(msg: string, duration?: number): void;
}

// Nuxt 全局类型扩展
declare module "#app" {
  interface NuxtApp {
    $toast: ToastMethods;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $toast: ToastMethods;
  }
}
