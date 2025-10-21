<template>
  <div class="mbti-card-wrapper">
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

        <div class="traits">
          <div
            class="trait-row"
            v-for="(trait, index) in traits"
            :key="trait.label"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="trait-label">
              {{ trait.label }}
            </div>

            <div class="tooltip-wrapper" v-if="trait.tooltip">
              <span class="tooltip-icon">?</span>
              <span class="tooltip-text">{{ trait.tooltip }}</span>
            </div>

            <div class="bar-wrapper">
              <div class="bar-background"></div>
              <div class="bar" :style="{ width: trait.animatedWidth + '%' }">
                <span class="percentage">{{ trait.displayedValue }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";

interface Trait {
  label: string;
  value: number;
  tooltip?: string;
  animatedWidth?: number;
  displayedValue?: number;
}

interface Props {
  mbti: string;
  name: string;
  description: string;
  traits: Trait[];
}

const props = defineProps<Props>();
const { mbti, name, description } = props;

const traits = ref(
  props.traits.map((trait) => ({
    ...trait,
    animatedWidth: 0,
    displayedValue: 0,
  }))
);

const mbtiMap = {
  INFJ: {
    img:
      "https://liuyuyang.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FINFJ.aec7e324.png&w=640&q=75",
  },
  INFP: { img: "https://i.ibb.co/3W8w2pV/infp.png" },
  ENFP: { img: "https://i.ibb.co/xjQGbH1/enfp.png" },
  ENFJ: { img: "https://i.ibb.co/0sZjFHz/enfj.png" },
};

const characterImg =
  mbtiMap[mbti]?.img ||
  "https://liuyuyang.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FINFJ.aec7e324.png&w=640&q=75";

onMounted(async () => {
  await nextTick();
  traits.value.forEach((trait, index) => {
    setTimeout(() => {
      const duration = 1000;
      const stepTime = 20;
      const steps = duration / stepTime;
      let currentStep = 0;
      const endValue = trait.value;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        trait.animatedWidth = endValue * progress;
        trait.displayedValue = Math.round(endValue * progress);

        if (currentStep >= steps) {
          trait.animatedWidth = endValue;
          trait.displayedValue = endValue;
          clearInterval(interval);
        }
      }, stepTime);
    }, index * 200);
  });
});
</script>

<style scoped>
.mbti-card-wrapper {
  display: flex;
  /* justify-content: center; */
  padding: 2rem 0;
  width: 100%;
}
.mbti-card {
  display: flex;
  border-radius: 1rem;
  overflow: hidden;
  /* max-width: 800px; */
  width: 100%;
  color: #fff;
  background: #2c3e50;
}

.character {
  position: relative;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.character img {
  width: 200px;
  height: 200px;
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
    transform: translateY(-10px);
  }
}
.glow {
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.4), rgba(0, 0, 0, 0));
  border-radius: 50%;
  filter: blur(20px);
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
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.85rem;
  z-index: 3;
  background: rgba(0, 0, 0, 0.3);
}

.info {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.description {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.traits {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.trait-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: slideIn 0.6s forwards;
}

.trait-label {
  width: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  position: relative;
}
.tooltip-wrapper {
  margin-left: 4px;
  position: relative;
}
.tooltip-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 0.75rem;
  cursor: pointer;
}
.tooltip-text {
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
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
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.2);
}
.bar-background {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  z-index: 1;
}
.bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #81c784);
  border-radius: 8px;
  width: 0;
  transition: width 1s ease;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 4px; /* 内边距让数字不贴边 */
  color: #fff;
  font-size: 0.75rem;
  font-weight: bold;
}
.percentage {
  white-space: nowrap;
}

@keyframes slideIn {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
