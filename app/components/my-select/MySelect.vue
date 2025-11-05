<template>
  <div :class="['relative w-full', sizeClasses.wrapper]" ref="wrapperRef">
    <!-- 输入框 -->
    <div
      :class="[
        'flex items-center justify-between border rounded px-3 cursor-pointer transition-colors',
        sizeClasses.input,
        isOpen
          ? isDarkMode
            ? 'border-green-400'
            : 'border-green-500'
          : isDarkMode
          ? 'border-gray-600'
          : 'border-gray-300',
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700',
        'hover:border-green-400',
      ]"
      @click="toggleDropdown"
    >
      <span class="truncate" v-if="selectedOption">{{ selectedOption.label }}</span>
      <span class="truncate text-gray-400" v-else>{{ placeholder }}</span>
      <svg
        :class="{ 'transform rotate-180': isOpen }"
        class="w-4 h-4 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
          :stroke="isDarkMode ? '#68D391' : '#38A169'"
        />
      </svg>
    </div>

    <!-- 下拉列表 -->
    <transition name="dropdown-fade">
      <ul
        v-if="isOpen"
        :class="[
          'absolute z-10 mt-1 w-full rounded shadow-lg max-h-60 overflow-auto transition-colors duration-150',
          isDarkMode
            ? 'bg-gray-800 border border-gray-700 text-gray-200' // 调暗背景
            : 'bg-white border border-green-500 text-gray-700',
          sizeClasses.list,
        ]"
      >
        <li
          v-for="(option, index) in options"
          :key="index"
          @click="selectOption(option)"
          class="px-3 py-2 cursor-pointer transition-colors duration-150"
          :class="{
            'bg-gray-700 text-green-400 font-semibold':
              selectedOption && selectedOption.value === option.value && isDarkMode,
            'bg-gray-900 hover:bg-gray-700':
              !selectedOption || (selectedOption.value !== option.value && isDarkMode), // 调暗悬浮
            'bg-gray-100 text-green-500 font-semibold':
              selectedOption && selectedOption.value === option.value && !isDarkMode,
            'hover:bg-green-50':
              !selectedOption || (selectedOption.value !== option.value && !isDarkMode),
          }"
        >
          {{ option.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  defineProps,
  defineEmits,
  computed,
} from "vue";

interface Option {
  label: string;
  value: string | number;
}

const props = defineProps<{
  options: Option[];
  modelValue?: string | number;
  placeholder?: string;
  size?: "small" | "medium" | "large";
  darkMode?: boolean;
}>();

const emits = defineEmits(["update:modelValue", "change"]);

const isOpen = ref(false);
const selectedOption = ref<Option | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);

watch(
  () => props.modelValue,
  (val) => {
    selectedOption.value = props.options.find((opt) => opt.value === val) || null;
  },
  { immediate: true }
);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  selectedOption.value = option;
  emits("update:modelValue", option.value);
  emits("change", option.value);
  isOpen.value = false;
}

// 点击外部关闭
function handleClickOutside(event: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const isDarkMode = computed(() => props.darkMode === true);

// 尺寸样式
const sizeClasses = computed(() => {
  switch (props.size) {
    case "small":
      return { wrapper: "text-sm", input: "py-1 px-2 text-sm", list: "text-sm" };
    case "large":
      return { wrapper: "text-lg", input: "py-3 px-4 text-lg", list: "text-lg" };
    case "medium":
    default:
      return { wrapper: "text-base", input: "py-2 px-3 text-base", list: "text-base" };
  }
});
</script>

<style scoped>
/* 下拉动画 */
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.dropdown-fade-enter-to,
.dropdown-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}

/* 滚动条美化 */
ul::-webkit-scrollbar {
  width: 6px;
}
ul::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background-color: #68d391; /* success 色 */
}
ul::-webkit-scrollbar-thumb:hover {
  background-color: #48bb78;
}
</style>
