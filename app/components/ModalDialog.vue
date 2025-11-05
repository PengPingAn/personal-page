<template>
  <teleport to="body">
    <transition
      name="modal-macos"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-if="modelValue" class="modal-wrapper">
        <!-- 遮罩层 -->
        <!-- <div class="modal-mask" @click="onMaskClick"></div> -->

        <!-- 弹窗主体 -->
        <div ref="modalRef" :class="['modal-content', dark ? 'dark' : '']">
          <!-- 标题 -->
          <div class="modal-title">
            <slot name="title">{{ title }}</slot>
          </div>

          <!-- 内容 -->
          <div class="modal-body">
            <slot />
          </div>

          <!-- 按钮 -->
          <div class="modal-footer">
            <button
              v-if="showCancel"
              :class="['btn-cancel', dark ? 'dark-btn' : '']"
              @click="cancel"
            >
              {{ cancelText }}
            </button>
            <button
              v-if="showConfirm"
              :class="['btn-confirm', dark ? 'dark-btn' : '']"
              @click="confirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from "vue";

const modalRef = ref(null);

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "提示" },
  showCancel: { type: Boolean, default: true },
  showConfirm: { type: Boolean, default: true },
  cancelText: { type: String, default: "取消" },
  confirmText: { type: String, default: "确定" },
  closeOnMask: { type: Boolean, default: true },
  dark: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

function close() {
  emit("update:modelValue", false);
}

function onMaskClick() {
  if (props.closeOnMask) close();
}

function cancel() {
  emit("cancel");
  close();
}

/**
 * confirm 现在支持三种写法：
 * - emit("confirm") => 如果返回 true，则关闭
 * - emit("confirm", done) => 父组件手动调用 done() 关闭
 * - emit("confirm") => 如果是 Promise，则等 Promise resolve(true) 才关闭
 */
async function confirm() {
  const result = emit("confirm", close);

  // 如果 emit 没返回值（常规事件），不自动关
  if (!result || result.length === 0) return;

  const maybePromise = result[0];
  if (maybePromise instanceof Promise) {
    const ok = await maybePromise;
    if (ok) close();
  } else if (maybePromise === true) {
    close();
  }
}

// macOS 弹窗缩放动画钩子
function beforeEnter(el) {
  el.style.transformOrigin = "top center";
  el.style.transform = "scale(0.8)";
  el.style.opacity = "0";
}

function enter(el, done) {
  el.offsetHeight; // force reflow
  el.style.transition = "all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)";
  el.style.transform = "scale(1)";
  el.style.opacity = "1";
  el.addEventListener("transitionend", done);
}

function leave(el, done) {
  el.style.transition = "all 0.2s ease-in";
  el.style.transform = "scale(0.8)";
  el.style.opacity = "0";
  el.addEventListener("transitionend", done);
}
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-mask {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(0px);
}

.modal-content {
  position: relative;
  z-index: 10;
  background-color: #fff;
  color: #222;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* 黑暗模式 */
.modal-content.dark {
  background-color: #1f1f1f;
  color: #f0f0f0;
}

/* 标题和内容 */
.modal-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
}
.modal-body {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
}

/* 按钮 */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-cancel {
  padding: 6px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background-color: #f5f5f5;
}
.btn-confirm {
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background-color: #00bd87;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.btn-confirm:hover {
  background-color: #6a9e61;
}
.btn-cancel.dark-btn {
  border-color: #444;
  color: #f0f0f0;
}
.btn-cancel.dark-btn:hover {
  background-color: #333;
}
.btn-confirm.dark-btn {
  background-color: #409eff;
  color: #fff;
}
.btn-confirm.dark-btn:hover {
  background-color: #66b1ff;
}
</style>
