<template>
  <div
    :class="[
      'p-8 font-sans min-h-screen text-gray-800 transition-colors duration-300 animate-fadeIn',
      darkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gray-50 text-gray-800',
    ]"
  >
    <p class="text-3xl font-semibold text-center mb-8">
      用户信息
      <span
        :class="
          darkMode ? 'fluent--edit-lock-24-regular-dark' : 'fluent--edit-lock-24-regular'
        "
        @click="showDialog = true"
        class="cursor-pointer"
        title="修改密码"
      ></span>
    </p>

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
              class="input"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">昵称</label>
            <input
              v-model="formValue.nickName"
              type="text"
              placeholder="昵称"
              class="input"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">邮箱</label>
            <input
              v-model="formValue.email"
              type="email"
              placeholder="邮箱"
              class="input"
            />
          </div>

          <div class="flex flex-col">
            <label class="font-medium mb-1">头像地址</label>
            <input
              v-model="formValue.headUrl"
              type="text"
              placeholder="头像地址"
              class="input"
            />
          </div>
        </form>
      </div>

      <ModalDialog
        :dark="darkMode"
        v-model="showDialog"
        title="修改密码"
        @confirm="onConfirm"
        @cancel="onCancel"
      >
        <div class="space-y-4">
          <!-- 旧密码 -->
          <div class="flex flex-col">
            <label class="text-base mb-1">旧密码</label>
            <input
              class="input"
              v-model="pwdValue.oldPwd"
              type="password"
              placeholder="请输入旧密码"
              autocomplete="off"
            />
          </div>

          <!-- 新密码 -->
          <div class="flex flex-col">
            <label class="text-base mb-1">新密码</label>
            <input
              class="input"
              v-model="pwdValue.newPwd"
              type="password"
              placeholder="请输入新密码"
              autocomplete="off"
            />
          </div>

          <!-- 确认新密码 -->
          <div class="flex flex-col">
            <label class="text-base mb-1">确认新密码</label>
            <input
              class="input"
              v-model="pwdValue.confirmPwd"
              type="password"
              placeholder="请再次输入新密码"
              autocomplete="off"
            />
          </div>
        </div>
      </ModalDialog>
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
const showDialog = ref(false);
const router = useRouter();
const formValue = reactive({
  account: "",
  nickName: "",
  email: "",
  headUrl: "",
});
const pwdValue = reactive({
  oldPwd: "",
  newPwd: "",
  confirmPwd: "",
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

const onConfirm = async () => {
  if (pwdValue.newPwd !== pwdValue.confirmPwd) {
    $toast.warning("两次密码不一致");
    return false;
  }
  try {
    const res = await $request.Post("/auth/update_password", {
      oldPassword: pwdValue.oldPwd,
      newPassword: pwdValue.newPwd,
    });
    if (res.code === 200) {
      $toast.success("修改成功，即将退出登录");
      userStore.logout();
      router.push("/admin/login");
    } else {
      $toast.error(res.msg);
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

.fluent--edit-lock-24-regular-dark {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M15.891 3.048a3.578 3.578 0 1 1 5.061 5.06l-1.803 1.804a3.5 3.5 0 0 0-1.71-.411l.5-.5L15 6.06l-9.998 10c-.21.21-.358.474-.427.763l-.813 3.415l3.416-.813c.289-.069.553-.216.763-.426l4.143-4.143A2.5 2.5 0 0 0 12 15.5v1.562L9.002 20.06a3.1 3.1 0 0 1-1.477.826L2.924 21.98a.75.75 0 0 1-.904-.903l1.096-4.602c.133-.559.419-1.07.825-1.476zm4 1.06a2.08 2.08 0 0 0-2.94 0l-.89.892L19 7.94l.891-.892a2.08 2.08 0 0 0 0-2.94M15 14v-1a2.5 2.5 0 0 1 5 0v1h.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-5a1.5 1.5 0 0 1 1.5-1.5zm1.5-1v1h2v-1a1 1 0 1 0-2 0m2 5a1 1 0 1 0-2 0a1 1 0 0 0 2 0' stroke-width='0.5' stroke='%23fff'/%3E%3C/svg%3E");
}
.fluent--edit-lock-24-regular {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M15.891 3.048a3.578 3.578 0 1 1 5.061 5.06l-1.803 1.804a3.5 3.5 0 0 0-1.71-.411l.5-.5L15 6.06l-9.998 10c-.21.21-.358.474-.427.763l-.813 3.415l3.416-.813c.289-.069.553-.216.763-.426l4.143-4.143A2.5 2.5 0 0 0 12 15.5v1.562L9.002 20.06a3.1 3.1 0 0 1-1.477.826L2.924 21.98a.75.75 0 0 1-.904-.903l1.096-4.602c.133-.559.419-1.07.825-1.476zm4 1.06a2.08 2.08 0 0 0-2.94 0l-.89.892L19 7.94l.891-.892a2.08 2.08 0 0 0 0-2.94M15 14v-1a2.5 2.5 0 0 1 5 0v1h.5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-5a1.5 1.5 0 0 1 1.5-1.5zm1.5-1v1h2v-1a1 1 0 1 0-2 0m2 5a1 1 0 1 0-2 0a1 1 0 0 0 2 0' stroke-width='0.5' stroke='%23000'/%3E%3C/svg%3E");
}
</style>
