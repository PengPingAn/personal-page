<template>
  <div class="container">
    <div class="flex justify-center">
      <canvas
        ref="canvasRef"
        class="rounded-xl border border-neutral-800 shadow-lg"
        role="img"
        aria-label="图像的像素化渲染"
        :style="{
          width: width + 'px',
          height: height + 'px',
          backgroundColor: backgroundColor,
        }"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  src: { type: String, default: "https://assets.aceternity.com/manu-red.png" },
  width: { type: Number, default: 400 },
  height: { type: Number, default: 500 },
  cellSize: { type: Number, default: 3 },
  dotScale: { type: Number, default: 0.9 },
  shape: { type: String, default: "square" }, // 'circle' 或 'square'
  backgroundColor: { type: String, default: "#000000" },
  grayscale: { type: Boolean, default: false },
  dropoutStrength: { type: Number, default: 0.4 },
  interactive: { type: Boolean, default: true },
  distortionStrength: { type: Number, default: 3 },
  distortionRadius: { type: Number, default: 80 },
  distortionMode: { type: String, default: "swirl" }, // 'repel', 'attract', 'swirl'
  followSpeed: { type: Number, default: 0.2 },
  sampleAverage: { type: Boolean, default: true },
  tintColor: { type: String, default: "#FFFFFF" },
  tintStrength: { type: Number, default: 0.2 },
  maxFps: { type: Number, default: 60 },
  objectFit: { type: String, default: "cover" },
  jitterStrength: { type: Number, default: 4 },
  jitterSpeed: { type: Number, default: 4 },
  fadeOnLeave: { type: Boolean, default: true },
  fadeSpeed: { type: Number, default: 0.1 },
});

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let samples: any[] = [];
let dims: any = null;
let targetMouse = { x: -9999, y: -9999 };
let animMouse = { x: -9999, y: -9999 };
let rafId: number | null = null;
let lastFrame = 0;
let pointerInside = false;
let activity = 0;
let activityTarget = 0;
let img: any = null;

// ----------- 辅助函数 ----------------
function luminanceAt(
  data: Uint8ClampedArray,
  width: number,
  stride: number,
  px: number,
  py: number
) {
  const ix = Math.max(0, Math.min(width - 1, px));
  const iy = Math.max(0, Math.floor(stride / (width * 4)) - 1, py);
  const i = iy * stride + ix * 4;
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hash2D(ix: number, iy: number) {
  const s = Math.sin(ix * 12.9898 + iy * 78.233) * 43758.5453123;
  return s - Math.floor(s);
}

function parseColor(c: string) {
  if (c.startsWith("#")) {
    const hex = c.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }
  const m = c.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
  if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  return null;
}

// ----------- 核心函数 ----------------
function computeSamples(img: HTMLImageElement) {
  if (!canvasRef.value) return;
  ctx = canvasRef.value.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = props.width;
  const displayHeight = props.height;

  canvasRef.value.width = Math.max(1, Math.floor(displayWidth * dpr));
  canvasRef.value.height = Math.max(1, Math.floor(displayHeight * dpr));
  canvasRef.value.style.width = `${displayWidth}px`;
  canvasRef.value.style.height = `${displayHeight}px`;

  ctx.resetTransform();
  ctx.scale(dpr, dpr);

  if (props.backgroundColor) {
    ctx.fillStyle = props.backgroundColor;
    ctx.fillRect(0, 0, displayWidth, displayHeight);
  } else {
    ctx.clearRect(0, 0, displayWidth, displayHeight);
  }

  const offscreen = document.createElement("canvas");
  offscreen.width = displayWidth;
  offscreen.height = displayHeight;
  const off = offscreen.getContext("2d")!;

  // object-fit
  let iw = img.naturalWidth || displayWidth;
  let ih = img.naturalHeight || displayHeight;
  let dw = displayWidth;
  let dh = displayHeight;
  let dx = 0;
  let dy = 0;
  if (props.objectFit === "cover") {
    const scale = Math.max(displayWidth / iw, displayHeight / ih);
    dw = Math.ceil(iw * scale);
    dh = Math.ceil(ih * scale);
    dx = Math.floor((displayWidth - dw) / 2);
    dy = Math.floor((displayHeight - dh) / 2);
  } else if (props.objectFit === "contain") {
    const scale = Math.min(displayWidth / iw, displayHeight / ih);
    dw = Math.ceil(iw * scale);
    dh = Math.ceil(ih * scale);
    dx = Math.floor((displayWidth - dw) / 2);
    dy = Math.floor((displayHeight - dh) / 2);
  }

  off.drawImage(img, dx, dy, dw, dh);
  const imageData = off.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;
  const stride = offscreen.width * 4;
  const effectiveDotSize = Math.max(1, Math.floor(props.cellSize * props.dotScale));
  dims = { width: displayWidth, height: displayHeight, dot: effectiveDotSize };

  const tintRGB =
    props.tintColor && props.tintStrength > 0 ? parseColor(props.tintColor) : null;

  samples = [];
  for (let y = 0; y < offscreen.height; y += props.cellSize) {
    const cy = Math.min(offscreen.height - 1, y + Math.floor(props.cellSize / 2));
    for (let x = 0; x < offscreen.width; x += props.cellSize) {
      const cx = Math.min(offscreen.width - 1, x + Math.floor(props.cellSize / 2));
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      if (!props.sampleAverage) {
        const idx = cy * stride + cx * 4;
        r = data[idx];
        g = data[idx + 1];
        b = data[idx + 2];
        a = data[idx + 3] / 255;
      } else {
        let count = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            const sx = Math.max(0, Math.min(offscreen.width - 1, cx + ox));
            const sy = Math.max(0, Math.min(offscreen.height - 1, cy + oy));
            const sIdx = sy * stride + sx * 4;
            r += data[sIdx];
            g += data[sIdx + 1];
            b += data[sIdx + 2];
            a += data[sIdx + 3] / 255;
            count++;
          }
        }
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = a / count;
      }

      if (props.grayscale) {
        const L = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
        r = L;
        g = L;
        b = L;
      } else if (tintRGB && props.tintStrength > 0) {
        const k = Math.max(0, Math.min(1, props.tintStrength));
        r = Math.round(r * (1 - k) + tintRGB[0] * k);
        g = Math.round(g * (1 - k) + tintRGB[1] * k);
        b = Math.round(b * (1 - k) + tintRGB[2] * k);
      }

      const Lc = luminanceAt(data, offscreen.width, stride, cx, cy);
      const Lx1 = luminanceAt(data, offscreen.width, stride, cx - 1, cy);
      const Lx2 = luminanceAt(data, offscreen.width, stride, cx + 1, cy);
      const Ly1 = luminanceAt(data, offscreen.width, stride, cx, cy - 1);
      const Ly2 = luminanceAt(data, offscreen.width, stride, cx, cy + 1);
      const grad =
        Math.abs(Lx2 - Lx1) +
        Math.abs(Ly2 - Ly1) +
        Math.abs(Lc - (Lx1 + Lx2 + Ly1 + Ly2) / 4);
      const gradientNorm = Math.max(0, Math.min(1, grad / 255));
      const dropoutProb = Math.max(
        0,
        Math.min(1, (1 - gradientNorm) * props.dropoutStrength)
      );
      const drop = hash2D(cx, cy) < dropoutProb;
      const seed = hash2D(cx, cy);

      samples.push({ x, y, r, g, b, a, drop, seed });
    }
  }
}

function renderStatic() {
  if (!dims || !samples || !ctx) return;
  if (props.backgroundColor) {
    ctx.fillStyle = props.backgroundColor;
    ctx.fillRect(0, 0, dims.width, dims.height);
  } else {
    ctx.clearRect(0, 0, dims.width, dims.height);
  }

  ctx.fillStyle = props.backgroundColor;
  ctx.fillRect(0, 0, props.width, props.height);

  for (const s of samples) {
    if (s.drop || s.a <= 0) continue;
    ctx.globalAlpha = s.a;
    ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
    if (props.shape === "circle") {
      const radius = dims.dot / 2;
      ctx.beginPath();
      ctx.arc(s.x + props.cellSize / 2, s.y + props.cellSize / 2, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(
        s.x + props.cellSize / 2 - dims.dot / 2,
        s.y + props.cellSize / 2 - dims.dot / 2,
        dims.dot,
        dims.dot
      );
    }
  }
  ctx.globalAlpha = 1;
}

function animate() {
  if (!dims || !samples || !ctx) return;
  const now = performance.now();
  const minDelta = 1000 / Math.max(1, props.maxFps);
  if (now - lastFrame < minDelta) {
    rafId = requestAnimationFrame(animate);
    return;
  }
  lastFrame = now;

  animMouse.x += (targetMouse.x - animMouse.x) * props.followSpeed;
  animMouse.y += (targetMouse.y - animMouse.y) * props.followSpeed;
  if (props.fadeOnLeave) activity += (activityTarget - activity) * props.fadeSpeed;
  else activity = pointerInside ? 1 : 0;

  if (props.backgroundColor) ctx.fillStyle = props.backgroundColor;
  ctx.fillRect(0, 0, dims.width, dims.height);

  const mx = animMouse.x;
  const my = animMouse.y;
  const sigma = Math.max(1, props.distortionRadius * 0.5);
  const t = now * 0.001 * props.jitterSpeed;
  const act = Math.max(0, Math.min(1, activity));

  for (const s of samples) {
    if (s.drop || s.a <= 0) continue;

    let drawX = s.x + props.cellSize / 2;
    let drawY = s.y + props.cellSize / 2;
    const dx = drawX - mx;
    const dy = drawY - my;
    const dist2 = dx * dx + dy * dy;
    const falloff = Math.exp(-dist2 / (2 * sigma * sigma));
    const influence = falloff * act;

    if (influence > 0.0005) {
      if (props.distortionMode === "repel") {
        const dist = Math.sqrt(dist2) + 0.0001;
        drawX += (dx / dist) * props.distortionStrength * influence;
        drawY += (dy / dist) * props.distortionStrength * influence;
      } else if (props.distortionMode === "attract") {
        const dist = Math.sqrt(dist2) + 0.0001;
        drawX -= (dx / dist) * props.distortionStrength * influence;
        drawY -= (dy / dist) * props.distortionStrength * influence;
      } else if (props.distortionMode === "swirl") {
        const angle = props.distortionStrength * 0.05 * influence;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rx = cosA * dx - sinA * dy;
        const ry = sinA * dx + cosA * dy;
        drawX = mx + rx;
        drawY = my + ry;
      }
      if (props.jitterStrength > 0) {
        const k = s.seed * 43758.5453;
        const jx = Math.sin(t + k) * props.jitterStrength * influence;
        const jy = Math.cos(t + k * 1.13) * props.jitterStrength * influence;
        drawX += jx;
        drawY += jy;
      }
    }

    ctx.globalAlpha = s.a;
    ctx.fillStyle = `rgb(${s.r}, ${s.g}, ${s.b})`;
    if (props.shape === "circle") {
      const radius = dims.dot / 2;
      ctx.beginPath();
      ctx.arc(drawX, drawY, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(drawX - dims.dot / 2, drawY - dims.dot / 2, dims.dot, dims.dot);
    }
  }
  ctx.globalAlpha = 1;

  rafId = requestAnimationFrame(animate);
}

// ----------- 生命周期 ----------------
onMounted(() => {
  if (!canvasRef.value) return;
  const dpr = window.devicePixelRatio || 1;
  canvasRef.value.width = Math.floor(props.width * dpr);
  canvasRef.value.height = Math.floor(props.height * dpr);
  ctx = canvasRef.value.getContext("2d");

  img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    computeSamples(img);
    if (!props.interactive) renderStatic();
    else rafId = requestAnimationFrame(animate);
  };
  img.onerror = () => console.error("无法加载图像:", props.src);
  img.src = props.src;

  // 事件监听
  canvasRef.value.addEventListener("pointermove", (e) => {
    const rect = canvasRef.value!.getBoundingClientRect();
    targetMouse.x = e.clientX - rect.left;
    targetMouse.y = e.clientY - rect.top;
    pointerInside = true;
    activityTarget = 1;
  });
  canvasRef.value.addEventListener("pointerenter", () => {
    pointerInside = true;
    activityTarget = 1;
  });
  canvasRef.value.addEventListener("pointerleave", () => {
    pointerInside = false;
    if (props.fadeOnLeave) activityTarget = 0;
    else targetMouse = { x: -9999, y: -9999 };
  });

  window.addEventListener("resize", onResize);
});

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener("resize", onResize);
});

watch(
  () => [props.src, props.width, props.height, props.cellSize],
  () => {
    if (img && img.complete) {
      computeSamples(img);
      if (!props.interactive) renderStatic();
    }
  }
);

function onResize() {
  if (!canvasRef.value) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = props.src;
  img.onload = () => computeSamples(img);
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

canvas {
  display: block;
  cursor: pointer;
}
</style>
