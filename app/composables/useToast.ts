import { reactive, readonly } from "vue";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const state = reactive<{ toasts: Toast[] }>({ toasts: [] });
let idCounter = 0;

function addToast(message: string, type: ToastType = "info", duration = 3000) {
  const id = ++idCounter;
  state.toasts.push({ id, message, type });
  setTimeout(() => {
    const index = state.toasts.findIndex((t) => t.id === id);
    if (index !== -1) state.toasts.splice(index, 1);
  }, duration);
}

export default function useToastComposable() {
  return {
    toasts: readonly(state.toasts),
    addToast,
  };
}
