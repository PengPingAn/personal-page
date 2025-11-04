<template>
  <div
    class="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md dark:bg-gray-800 dark:text-white"
  >
    <h2 class="text-xl font-bold mb-4">添加留言</h2>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
      <!-- 昵称 -->
      <div>
        <label class="block mb-1 font-medium"
          >昵称 <span class="text-red-500">*</span></label
        >
        <input
          type="text"
          v-model="form.name"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <!-- 邮箱 -->
      <div>
        <label class="block mb-1 font-medium"
          >邮箱 <span class="text-red-500">*</span></label
        >
        <input
          type="email"
          v-model="form.email"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <!-- 网站 -->
      <div>
        <label class="block mb-1 font-medium">网站</label>
        <input
          type="url"
          v-model="form.website"
          placeholder="https://example.com"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <!-- 内容 -->
      <div>
        <label class="block mb-1 font-medium"
          >内容 <span class="text-red-500">*</span></label
        >
        <textarea
          v-model="form.content"
          rows="4"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
          :class="{ 'border-red-500': errors.content }"
        ></textarea>
        <p v-if="errors.content" class="text-red-500 text-sm mt-1">
          {{ errors.content }}
        </p>
      </div>

      <!-- 按钮 -->
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        提交留言
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

// 表单数据
const form = reactive({
  name: "",
  email: "",
  website: "",
  content: "",
});

// 错误信息
const errors = reactive({
  name: "",
  email: "",
  content: "",
});

// 简单校验
const validate = () => {
  let valid = true;
  errors.name = form.name.trim() ? "" : "昵称不能为空";
  errors.email = form.email.trim() ? "" : "邮箱不能为空";
  errors.content = form.content.trim() ? "" : "内容不能为空";

  if (errors.name || errors.email || errors.content) {
    valid = false;
  }

  return valid;
};

// 提交事件
const handleSubmit = () => {
  if (!validate()) return;

  const newMessage = {
    name: form.name.trim(),
    email: form.email.trim(),
    website: form.website.trim(),
    content: form.content.trim(),
    date: new Date().toISOString(),
  };

  // 可以触发父组件事件，或者调用 API
  console.log("提交留言:", newMessage);
  alert("留言提交成功！");

  // 清空表单
  form.name = "";
  form.email = "";
  form.website = "";
  form.content = "";
};
</script>

<style scoped>
/* 可选暗黑模式 */
</style>
