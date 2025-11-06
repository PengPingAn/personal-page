<template>
  <div class="json-content max-h-[80vh] overflow-auto">
    <div class="content-head mb-8">
      <p class="text-3xl font-semibold text-center">创建json文件</p>
      <button @click="createFile" class="save-btn">新增</button>
    </div>

    <div class="flex flex-col">
      <label class="font-medium mb-1">文件名(不带.json)</label>
      <input
        v-model="formValue.fileName"
        type="text"
        placeholder="文件名(不带.json)"
        class="input"
      />
    </div>
    <div>
      <JsonEditorVue
        v-model="formValue.data"
        :mode="'text'"
        :search="true"
        :indentation="2"
        :history="true"
        :theme="darkMode ? 'dark' : 'light'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import "vue-json-pretty/lib/styles.css";
import JsonEditorVue from "json-editor-vue";

defineProps<{
  darkMode: boolean;
}>();

const formValue = ref({
  fileName: "",
  data: "",
});

const emit = defineEmits<{
  (e: "getFileList"): void;
}>();

const getContentObject = () => {
  if (!formValue.value.data) return {};
  if (typeof formValue.value.data === "string") {
    try {
      return JSON.parse(formValue.value.data);
    } catch {
      return {};
    }
  }
  return formValue.value.data;
};
const createFile = async () => {
  try {
    const res = await $request.Post("/file/create", {
      file: formValue.value.fileName,
      data: getContentObject(),
    });
    if (res.code === 200) {
      $toast.success("创建成功");
      emit("getFileList");
    } else {
      $toast.error("创建失败");
    }
  } catch (err) {
    console.error("修改失败:", err);
  }
};
</script>

<style scoped>
.json-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.save-btn {
  padding: 0.3rem 1.5rem;
  border-radius: 3px;
  border: none;
  background-color: #10b981;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  width: max-content;
}
.save-btn:hover {
  background-color: #059669;
}
.content-head {
  display: flex;
  justify-content: space-between;
}
</style>
