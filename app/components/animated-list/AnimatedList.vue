<template>
  <div
    :class="
      cn(
        'flex flex-col items-center gap-4 overflow-y-auto  p-2', // ✅ 允许滚动并设置最大高度
        $props.class
      )
    "
  >
    <transition-group
      name="list"
      tag="div"
      class="flex flex-col-reverse items-center gap-3 text-[#000] w-full"
      move-class="move"
    >
      <Motion
        v-for="data in itemsToShow"
        :key="data.id"
        as="div"
        :initial="{ scale: 0, opacity: 0 }"
        :animate="{ scale: 1, opacity: 1, y: 0 }"
        :exit="{ scale: 0, opacity: 0, y: 0 }"
        :transition="{ type: 'spring', stiffness: 350, damping: 40 }"
        class="mx-auto w-full"
      >
        <component :is="data.node" />
      </Motion>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { Motion } from "motion-v";
import { computed, onMounted, ref, useSlots } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: string;
  delay?: number;
  maxHeight?: string; // ✅ 允许通过 props 控制最大高度
}

const props = withDefaults(defineProps<Props>(), {
  delay: 1000,
  maxHeight: "400px",
});

const slots = useSlots();
const displayedItems = ref<{ node: unknown; id: string }[]>([]);

onMounted(startOnce);

async function startOnce() {
  const notifications = slots.default ? slots.default()[0].children ?? [] : [];
  if (!notifications.length) return;

  // 一次性播放所有内容
  for (let i = 0; i < notifications.length; i++) {
    displayedItems.value.push({
      node: notifications[i],
      id: `${i}-${Date.now()}`,
    });
    await wait(props.delay);
  }
}

const itemsToShow = computed(() => displayedItems.value);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style scoped>
.move {
  transition: transform 0.4s ease-out;
}

/* ✅ 美化滚动条 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}
</style>
