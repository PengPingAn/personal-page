<template>
  <div
    ref="containerRef"
    class="relative"
    :style="{
      width: `${canvasWidth || naturalWidth}px`,
      height: `${canvasHeight || naturalHeight}px`,
    }"
  >
    <img
      ref="imageParticleRef"
      :src="imageSrc"
      class="absolute inset-0 w-full h-full opacity-0"
      :data-particle-gap="particleGap"
      :data-width="canvasWidth"
      :data-height="canvasHeight"
      :data-gravity="gravity"
      :data-particle-size="particleSize"
      :data-mouse-force="mouseForce"
      :data-renderer="renderer"
      :data-color="color"
      :data-color-arr="colorArr"
      :data-init-position="initPosition"
      :data-init-direction="initDirection"
      :data-fade-position="fadePosition"
      :data-fade-direction="fadeDirection"
      :data-noise="noise"
      :data-responsive-width="responsiveWidth"
      :data-hover-strength="strength"
      :data-hover-radius="radius"
      @load="onImageLoad"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { cn } from "@/lib/utils";
import {
  inspiraImageParticles,
  type InspiraImageParticle as ImageParticle,
} from "./inspiraImageParticles";

type ParticleImageProps = {
  imageSrc: string;
  class?: string;
  canvasWidth?: number;
  canvasHeight?: number;
  gravity?: string;
  particleSize?: number;
  particleGap?: string;
  mouseForce?: string;
  renderer?: "default" | "webgl";
  color?: string;
  colorArr?: number[];
  initPosition?: "random" | "top" | "left" | "bottom" | "right" | "misplaced" | "none";
  initDirection?: "random" | "top" | "left" | "bottom" | "right" | "none";
  fadePosition?: "explode" | "top" | "left" | "bottom" | "right" | "random" | "none";
  fadeDirection?: "random" | "top" | "left" | "bottom" | "right" | "none";
  noise?: number;
  responsiveWidth?: boolean;
  strength?:number;
  radius?:number
};

const props = defineProps<ParticleImageProps>();

const imageParticleRef = ref<HTMLImageElement>();
const containerRef = ref<HTMLDivElement>();
let particles: ImageParticle;
const naturalWidth = ref(0);
const naturalHeight = ref(0);

function onImageLoad() {
  if (!imageParticleRef.value) return;

  naturalWidth.value = imageParticleRef.value.naturalWidth;
  naturalHeight.value = imageParticleRef.value.naturalHeight;

  // ✅ 初始化粒子效果时，确保宽高已知
  const { InspiraImageParticle } = inspiraImageParticles();
  particles = new InspiraImageParticle(imageParticleRef.value);

  // ✅ 若设置 responsiveWidth，则监听容器大小变化
  if (props.responsiveWidth && containerRef.value) {
    const observer = new ResizeObserver(() => {
      particles?.resize?.();
    });
    observer.observe(containerRef.value);
  }
}
</script>
