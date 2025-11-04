<template>
  <div class="p-[3px]">
    <div class="flex gap-6">
      <div class="group !w-[80%]">
        <input
          id="query"
          class="input"
          type="search"
          placeholder="昵称*"
          name="searchbar"
          v-model="formValue.nickName"
          autocomplete="off"
        />
      </div>
      <div class="group">
        <input
          id="query"
          class="input"
          type="search"
          placeholder="邮箱*"
          name="searchbar"
          v-model="formValue.email"
          autocomplete="off"
        />
      </div>
    </div>
    <div class="w-full input !h-[10rem] mt-4" style="padding: 0">
      <textarea
        id="query"
        class="textarea"
        type="textarea"
        placeholder="写点什么吧"
        name="searchbar"
        style="resize: none"
        v-model="formValue.content"
      />
      <div style="padding: 0 1rem" class="flex items-center justify-between">
        <div class="flex gap-1 text-xs"></div>
        <div class="flex items-center cta gap-1">
          <span>{{ formValue.content.length }}/500</span>
          <button class="send-button flex items-center gap-1" @click="btn_submit">
            <span style="font-size: 14px; color: var(--font-color)">送信</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/pinia";

const { $toast } = useNuxtApp();
const props = withDefaults(
  defineProps<{
    isMd: boolean;
  }>(),
  {
    isMd: true,
  }
);

const userStore = useUserStore();

const formValue = ref({
  nickName: "",
  email: "",
  webSite: "",
  content: "",
  address: "",
});

watch(
  () => userStore.$state,
  (state) => {
    formValue.value.nickName = state.name;
    formValue.value.email = state.email;
    formValue.value.webSite = state.webSite;
  },
  { immediate: true } // 页面加载时立即执行一次
);

const emit = defineEmits(["submit"]);
const btn_submit = () => {
  if (!formValue.value.nickName || formValue.value.nickName === "") {
    $toast.warning("取个名字吧");
    return;
  }
  if (!formValue.value.email || formValue.value.email === "") {
    $toast.warning("邮箱忘记填了呢");
    return;
  }
  if (!formValue.value.content || formValue.value.content === "") {
    $toast.warning("写点什么吧");
    return;
  }

  if (formValue.value.content.length > 500) {
    $toast.warning("内容不要超过500字符");
    return;
  }

  formValue.value.address = userStore.address;
  emit("submit", formValue.value);

  formValue.value.content = "";
};
</script>

<style src="./style.scss" scoped></style>
