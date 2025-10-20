<template>
  <div class="resizable-label" ref="root">
    <!-- background box + dashed border -->
    <div
      class="bg-box"
      :style="{
        background: bgColor,
        borderColor: borderColor,
        width: textSize.width + padding * 2 + 'px',
        height: textSize.height + padding * 2 + 'px',
      }"
      v-show="enabled"
    ></div>

    <!-- text -->
    <div
      class="text"
      ref="textEl"
      :style="{ fontSize: fontSize + 'px', color: textColor }"
    >
      {{ text }}
    </div>

    <!-- corner handles -->
    <div
      v-for="pos in corners"
      :key="pos.name"
      class="handle"
      :class="pos.name"
      :style="getHandleStyle(pos.name)"
      @mousedown.prevent="startDrag(pos.name, $event)"
      @touchstart.prevent="startDrag(pos.name, $event)"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onBeforeUnmount } from "vue";

const props = defineProps({
  text: { type: String, default: "开发者" },
  enabled: { type: Boolean, default: true },
  resizable: { type: Boolean, default: true },
  bgColor: { type: String, default: "rgba(0,0,0,0.12)" },
  borderColor: { type: String, default: "rgba(0,0,0,0.6)" },
  padding: { type: Number, default: 10 },
  minFontSize: { type: Number, default: 12 },
  maxFontSize: { type: Number, default: 72 },
  initialFontSize: { type: Number, default: 20 },
  textColor: { type: String, default: "#FFFFFF" },
});

const textEl = ref(null);
const fontSize = ref(props.initialFontSize);
const textSize = reactive({ width: 0, height: 0 });
const padding = props.padding;
const corners = [{ name: "tl" }, { name: "tr" }, { name: "bl" }, { name: "br" }];

let dragging = null;

function updateTextSize() {
  nextTick(() => {
    if (textEl.value) {
      const rect = textEl.value.getBoundingClientRect();
      textSize.width = rect.width;
      textSize.height = rect.height;
    }
  });
}

watch(() => props.text, updateTextSize, { immediate: true });
watch(fontSize, updateTextSize);

function startDrag(corner, e) {
  if (!props.resizable) return;
  const evt = e.type.startsWith("touch") ? e.touches[0] : e;
  dragging = {
    corner,
    startX: evt.clientX,
    startY: evt.clientY,
    startFont: fontSize.value,
  };
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchmove", onDrag, { passive: false });
  window.addEventListener("touchend", endDrag);
}

function onDrag(e) {
  if (!dragging) return;
  const evt = e.type.startsWith("touch") ? e.touches[0] : e;
  const dy = evt.clientY - dragging.startY;
  const scale = 1 + dy / 100;
  let newFont = Math.round(dragging.startFont * scale);
  fontSize.value = Math.max(props.minFontSize, Math.min(props.maxFontSize, newFont));
}

function endDrag() {
  dragging = null;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", onDrag);
  window.removeEventListener("touchend", endDrag);
}

onBeforeUnmount(() => {
  endDrag();
});

function getHandleStyle(pos: string) {
  const half = 3.5;
  const w = textSize.width + padding * 2;
  const h = textSize.height + padding * 2;
  const topBase = `calc(50% - ${h / 2}px)`;
  const leftBase = `calc(50% - ${w / 2}px)`;

  switch (pos) {
    case "tl":
      return {
        top: `calc(${topBase} - ${half}px)`,
        left: `calc(${leftBase} - ${half}px)`,
      };
    case "tr":
      return {
        top: `calc(${topBase} - ${half}px)`,
        left: `calc(${leftBase} + ${w - half}px)`,
      };
    case "bl":
      return {
        top: `calc(${topBase} + ${h - half}px)`,
        left: `calc(${leftBase} - ${half}px)`,
      };
    case "br":
      return {
        top: `calc(${topBase} + ${h - half}px)`,
        left: `calc(${leftBase} + ${w - half}px)`,
      };
  }
}
</script>

<style scoped>
.resizable-label {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  box-sizing: border-box;
}

.bg-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border: 1px dashed;
  border-radius: 4px;
  box-sizing: border-box;
}

.text {
  position: relative;
  z-index: 3;
  display: inline-block;
  white-space: nowrap;
  pointer-events: none;
  color: #25ebb0;
}

.handle {
  width: 7px;
  height: 7px;
  position: absolute;
  z-index: 4;
  background: rgba(252, 252, 252, 0.8);
  border-radius: 2px;
  border: 1px solid;
}
</style>
