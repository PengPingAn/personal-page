<template>
  <div
    :class="[
      'p-8 font-sans min-h-screen text-gray-800 transition-colors duration-300 animate-fadeIn',
      darkMode ? 'bg-[#1a1a1a] text-gray-100' : 'bg-gray-50 text-gray-800',
    ]"
  >
    <p class="text-3xl font-semibold text-center mb-8">用户信息</p>

    <div class="flex flex-wrap justify-center gap-8">
      <!-- 左侧：头像和登录信息 -->
      <div
        :class="[
          'flex flex-col items-center gap-4 p-6 rounded-xl transition-shadow  transform ',
          darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50',
        ]"
      >
        <div
          class="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
          @click="triggerFileInput"
        >
          <img
            :src="previewUrl || formValue.headUrl || defaultAvatar"
            alt="头像"
            class="w-full h-full object-cover"
          />
        </div>
        <input
          type="file"
          ref="fileInput"
          @change="handleFileChange"
          accept="image/*"
          class="hidden"
        />

        <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-sm mt-4">
          上次登录时间
        </p>
        <p class="font-medium">{{ displayTime }}</p>
        <p :class="darkMode ? 'text-gray-400' : 'text-gray-500'" class="text-sm">
          上次登录IP
        </p>
        <p class="font-medium">{{ lastIp }}</p>

        <button class="btn-confirm" @click="btnSubmit">保存</button>
      </div>

      <!-- 右侧：表单 -->
      <div
        :class="[
          'min-w-[300px] max-w-md flex-1 p-6 rounded-xl  animate-fadeIn',
          darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50',
        ]"
      >
        <form @submit.prevent="btnSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col">
            <label class="font-medium mb-1">账号</label>
            <input
              v-model="formValue.account"
              type="text"
              placeholder="账号"
              :class="[
                'px-3 py-2 rounded-sm border focus:outline-none focus:ring-2 transition',
                darkMode
                  ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-gray-100'
                  : 'border-gray-300 focus:ring-blue-400 bg-gray-50 text-gray-800',
              ]"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">昵称</label>
            <input
              v-model="formValue.nickName"
              type="text"
              placeholder="昵称"
              :class="[
                'px-3 py-2 rounded-sm border focus:outline-none focus:ring-2 transition',
                darkMode
                  ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-gray-100'
                  : 'border-gray-300 focus:ring-blue-400 bg-gray-50 text-gray-800',
              ]"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">邮箱</label>
            <input
              v-model="formValue.email"
              type="email"
              placeholder="邮箱"
              :class="[
                'px-3 py-2 rounded-sm border focus:outline-none focus:ring-2 transition',
                darkMode
                  ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-gray-100'
                  : 'border-gray-300 focus:ring-blue-400 bg-gray-50 text-gray-800',
              ]"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">头像地址</label>
            <input
              v-model="formValue.headUrl"
              type="text"
              placeholder="头像地址"
              :class="[
                'px-3 py-2 rounded-sm border focus:outline-none focus:ring-2 transition',
                darkMode
                  ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-gray-100'
                  : 'border-gray-300 focus:ring-blue-400 bg-gray-50 text-gray-800',
              ]"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps } from "vue";

const props = defineProps({
  darkMode: { type: Boolean, default: false },
});

const userStore = useUserStore();
const defaultAvatar = userStore.$state.head;

const formValue = reactive({
  account: "",
  nickName: "",
  email: "",
  headUrl: "",
});

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string>("");

const displayTime = ref();
const lastIp = ref();

let timer: any = null;
let lastTime: any = null;

const updateTime = () => {
  if (timer) clearTimeout(timer);

  const now = new Date();
  const past = new Date(lastTime);

  const diff = now.getTime() - past.getTime();
  const second = 1000;
  const minute = 60 * second;
  const hour = 60 * minute;
  const day = 24 * hour;

  const yearsDiff = now.getFullYear() - past.getFullYear();
  const monthsDiff = now.getMonth() - past.getMonth() + yearsDiff * 12;

  if (diff < minute) {
    displayTime.value = `${Math.floor(diff / second)}秒前`;
    timer = setTimeout(updateTime, second);
  } else if (diff < hour) {
    const mins = Math.floor(diff / minute);
    displayTime.value = `${mins}分钟前`;
    const nextUpdate = minute - (diff % minute);
    timer = setTimeout(updateTime, nextUpdate);
  } else if (diff < day) {
    const hrs = Math.floor(diff / hour);
    displayTime.value = `${hrs}小时前`;
    const nextUpdate = hour - (diff % hour);
    timer = setTimeout(updateTime, nextUpdate);
  } else if (diff < 30 * day) {
    // 用天数判断一个月内
    const days = Math.floor(diff / day);
    displayTime.value = `${days}天前`;
    const nextUpdate = day - (diff % day);
    timer = setTimeout(updateTime, nextUpdate);
  } else if (yearsDiff < 1) {
    displayTime.value = `${monthsDiff}个月前`;
    const nextMonth = new Date(past);
    nextMonth.setMonth(past.getMonth() + monthsDiff + 1);
    const nextUpdate = nextMonth.getTime() - now.getTime();
    timer = setTimeout(updateTime, nextUpdate);
  } else {
    displayTime.value = `${yearsDiff}年前`;
    const nextYear = new Date(past);
    nextYear.setFullYear(past.getFullYear() + yearsDiff + 1);
    const nextUpdate = nextYear.getTime() - now.getTime();
    timer = setTimeout(updateTime, nextUpdate);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    previewUrl.value = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const btnSubmit = async () => {
  console.log("保存数据:", {
    ...formValue,
    headUrl: previewUrl.value || formValue.headUrl,
  });
  try {
    const res = await $request.Post("/auth/update_info", {
      account: formValue.account,
      email: formValue.email,
      head: formValue.headUrl,
      nickName: formValue.nickName,
    });
    if (res.code === 200) {
      $toast.success("修改成功");
    } else {
      $toast.error("修改失败");
    }
  } catch (err) {
    console.error("修改失败:", err);
  }
};

onMounted(async () => {
  try {
    const res = await $request.Get("/auth/me");
    if (res.code === 200) {
      formValue.account = res.data.account;
      formValue.email = res.data.email;
      formValue.headUrl = res.data.head;
      formValue.nickName = res.data.nickName;
      lastTime = res.data.lastTime;
      lastIp.value = res.data.lastIp;

      updateTime();
    } else {
      $toast?.error("获取失败");
    }
  } catch (err) {
    console.error("保存文件失败:", err);
  }
});
</script>

<style scoped>
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease forwards;
}
.btn-confirm {
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background-color: #00bd87;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}
.btn-confirm:hover {
  background-color: #6a9e61;
}
</style>
