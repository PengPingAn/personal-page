<template>
  <div class="mbti-card-wrapper" v-if="props.mbtiCharacter">
    <div class="mbti-card">
      <!-- 左侧人物 -->
      <div class="character">
        <img :src="characterImg" alt="MBTI Character" />
        <div class="mbti-badge">{{ mbti }}</div>
        <div class="glow"></div>
      </div>
      <!-- 右侧信息 -->
      <div class="info">
        <h2 class="name">{{ name }}</h2>
        <p class="description">{{ description }}</p>
        <div class="trait">
          <div
            class="trait-row"
            v-for="(item, index) in traitList"
            :key="item.label"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="trait-label">{{ item.label }}</div>
            <div class="tooltip-wrapper" v-if="item.tooltip">
              <span class="tooltip-icon">?</span>
              <span class="tooltip-text">{{ item.tooltip }}</span>
            </div>
            <div class="bar-wrapper">
              <div class="bar-background"></div>
              <div class="bar" :style="{ width: item.displayedValue + '%' }">
                <span class="percentage">{{ item.displayedValue }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from "vue";

interface TraitData {
  label: string;
  value: number;
  tooltip?: string;
  animatedWidth?: number;
  displayedValue?: number;
}
interface MBTICharacter {
  mbti: string;
  name: string;
  description: string;
  imgUrl?: string;
  data: TraitData[];
}

const props = defineProps<{ mbtiCharacter: MBTICharacter }>();

/* 基本字段 */
const mbti = computed(() => props.mbtiCharacter?.mbti ?? "");
const name = computed(() => props.mbtiCharacter?.name ?? "");
const description = computed(() => props.mbtiCharacter?.description ?? "");

/* 图片 */
const characterImg = computed(() => {
  return (
    props.mbtiCharacter?.imgUrl ||
    "https://liuyuyang.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FINFJ.aec7e324.png&w=640&q=75"
  );
});

/* 动画 trait 列表 */
const traitList = ref<TraitData[]>([]);

/* 初始化动画数据 */
function initTraits() {
  if (!import.meta.client) return; // SSR 安全
  if (!props.mbtiCharacter?.data) return;

  // 避免重复初始化
  if (
    traitList.value.length === props.mbtiCharacter.data.length &&
    traitList.value.every(
      (item, index) => item.label === props.mbtiCharacter.data[index].label
    )
  ) {
    return;
  }

  traitList.value = props.mbtiCharacter.data.map((t) =>
    reactive({
      ...t,
      animatedWidth: 0,
      displayedValue: 0,
    })
  );

  nextTick(() => {
    traitList.value.forEach((item, index) => {
      setTimeout(() => {
        const duration = 1000;
        const stepTime = 20;
        const steps = duration / stepTime;
        let current = 0;
        const end = item.value;

        const timer = setInterval(() => {
          current++;
          const progress = current / steps;

          item.animatedWidth = end * progress;
          item.displayedValue = Math.round(end * progress);

          if (current >= steps) {
            item.animatedWidth = end;
            item.displayedValue = end;
            clearInterval(timer);
          }
        }, stepTime);
      }, index * 200);
    });
  });
}

/* 只在客户端首次挂载执行动画 */
onMounted(() => {
  initTraits();

  // 监听父组件传入数据变化，动画重置
  watch(
    () => props.mbtiCharacter,
    () => initTraits()
  );
});
</script>

<style scoped>
.mbti-card-wrapper {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
  width: 100%;
}
.mbti-card {
  display: flex;
  flex-direction: row;
  border-radius: 1rem;
  overflow: hidden;
  width: 100%;
  color: #fff; /* background: #2c3e50; */ /* backdrop-filter: blur(15px); */
  -webkit-backdrop-filter: blur(
    15px
  ); /* background-color: rgba(255, 255, 255, 0.1); */ /* border: 1px solid rgba(255, 255, 255, 0.2); */
} /* 人物部分 */
.character {
  position: relative;
  width: 40%;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.character img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  animation: float 3s ease-in-out infinite;
  z-index: 2;
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0));
  border-radius: 50%;
  filter: blur(15px);
  z-index: 1;
  animation: pulse 2.5s infinite;
}
@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}
.mbti-badge {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.75rem;
  z-index: 3;
  background: rgba(0, 0, 0, 0.3);
} /* 信息部分 */
.info {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.name {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.description {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}
.trait {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}
.trait-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  opacity: 0;
  animation: slideIn 0.5s forwards;
}
.trait-label {
  width: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
}
.tooltip-wrapper {
  margin-left: 2px;
  position: relative;
}
.tooltip-icon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  text-align: center;
  line-height: 14px;
  font-size: 0.7rem;
  cursor: pointer;
}
.tooltip-text {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 0.65rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}
.tooltip-wrapper:hover .tooltip-text {
  opacity: 1;
}
.bar-wrapper {
  flex: 1;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.2);
}
.bar-background {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  z-index: 1;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  border-radius: 6px;
  width: 0;
  transition: width 0.8s ease;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 2px;
  color: #fff;
  font-size: 0.65rem;
  font-weight: bold;
}
.percentage {
  white-space: nowrap;
}
@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
} /* ------------------响应式 H5 ------------------ */
@media (max-width: 640px) {
  .mbti-card {
    flex-direction: column;
  }
  .character {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  .character img {
    width: 100px;
    height: 100px;
  }
  .glow {
    width: 120px;
    height: 120px;
  }
  .info {
    padding: 0.5rem;
  }
  .name {
    font-size: 1rem;
  }
  .description {
    font-size: 0.8rem;
  }
  .bar-wrapper {
    height: 10px;
  }
  .bar {
    font-size: 0.6rem;
    padding-right: 1px;
  }
}
</style>
