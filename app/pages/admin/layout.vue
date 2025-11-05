<template>
  <div class="layout-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle" @click="toggleTheme">
      <span
        :class="isDarkMode ? 'line-md--sun-rising-filled-loop' : 'line-md--moon-loop'"
      ></span>
    </div>

    <div class="theme-toggle" style="bottom: 5rem" @click="jumpHome">
      <span :class="isDarkMode ? 'tabler--home-dark' : 'tabler--home-light'"></span>
    </div>

    <!-- 移动端侧边栏切换按钮 -->
    <div class="mobile-sidebar-toggle" @click="toggleMobileSidebar">
      <i class="fas fa-bars"></i>
    </div>

    <div class="app-container">
      <!-- 左侧侧边栏 -->
      <div
        class="sidebar bg-gradient-to-b from-accent/10 via-accent/5 to-transparent transition-all duration-300 theme-aware"
        :class="{ collapsed: !sidebarOpen }"
      >
        <div class="sidebar-header">
          <Text3d class="" shadow-color="red" :animate="false"> JSON文件列表 </Text3d>
        </div>

        <div class="nav-links">
          <a
            v-for="(link, index) in jsonFiles"
            :key="index"
            href="#"
            class="nav-link"
            :class="{ selected: selectedFileIndex === index }"
            @click.prevent="selectFile(index)"
          >
            <span
              :class="
                selectedFileIndex === index
                  ? 'qlementine-icons--file-text-16-select'
                  : 'qlementine-icons--file-text-16'
              "
            >
            </span>

            <span class="nav-link-text" v-show="sidebarOpen">{{ link }}</span>
          </a>
        </div>

        <div class="user-profile">
          <div class="user-avatar" @click="showUserInfo">
            <img v-if="userStore.head" :src="userStore.head" alt="用户头像" />
          </div>
          <span class="user-name nav-link" @click="handleLogout" v-show="sidebarOpen"
            >LOG OUT</span
          >
        </div>
      </div>

      <!-- 移动端侧边栏 -->
      <div class="mobile-sidebar" :class="{ open: mobileSidebarOpen }">
        <div class="mobile-sidebar-close" @click="toggleMobileSidebar">
          <i class="fas fa-times"></i>
        </div>

        <div class="sidebar-header">
          <a href="#" class="logo">
            <div class="logo-icon"></div>
            <span class="logo-text">Acet Labs</span>
          </a>
        </div>

        <div class="nav-links">
          <a
            v-for="(link, index) in jsonFiles"
            :key="index"
            href="#"
            class="nav-link"
            :class="{ selected: selectedFileIndex === index }"
            @click.prevent="selectFile(index)"
          >
            <i class="fas fa-file-alt"></i>
            <span class="nav-link-text">{{ link }}</span>
          </a>
        </div>

        <div class="user-profile">
          <div class="user-avatar">
            <img :src="userStore.head" alt="用户头像" />
          </div>
          <span class="user-name">LOG OUT</span>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="dashboard">
        <component
          :is="rightContent === 'userInfo' ? UserInfo : JsonContent"
          v-bind="
            rightContent === 'json'
              ? { selectedFile, darkMode: isDarkMode, onSaveFile: saveFile }
              : { darkMode: isDarkMode }
          "
        />
      </div>
    </div>

    <ModalDialog
      :dark="isDarkMode"
      v-model="show"
      title="确认操作"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <div class="flex gap-4 items-center my-4">
        <span class="flex-shrink-0 text-base">账号</span>
        <input
          id="query"
          class="input"
          type="search"
          placeholder="账号*"
          name="searchbar"
          autocomplete="off"
        />
      </div>
      <div class="flex gap-4 items-center my-4">
        <span class="flex-shrink-0 text-base">账号</span>
        <input
          id="query"
          class="input"
          type="search"
          placeholder="账号*"
          name="searchbar"
          autocomplete="off"
        />
      </div>
      <div class="flex gap-4 items-center my-4">
        <span class="flex-shrink-0 text-base">账号</span>
        <input
          id="query"
          class="input"
          type="search"
          placeholder="账号*"
          name="searchbar"
          autocomplete="off"
        />
      </div>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "vue-json-pretty/lib/styles.css";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/pinia";
import JsonContent from "./components/JsonContent.vue";
import UserInfo from "./components/UserInfo.vue";

const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);
const isDarkMode = ref(false);
const selectedFileIndex = ref<number | null>(null);
const selectedFile = ref<{ name: string; content: any } | null>(null);
const jsonFiles = ref<string[]>([]);
const userStore = useUserStore();
const router = useRouter();
const rightContent = ref<"json" | "userInfo">("json");

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value ? "1" : "0");
};

// 移动端侧边栏切换
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
};

// 选择文件
const selectFile = async (index: number) => {
  if (index < 0 || index >= jsonFiles.value.length) return;
  selectedFileIndex.value = index;
  rightContent.value = "json";

  localStorage.setItem("selectedFileIndex", index.toString());
  localStorage.setItem("rightContent", "json");

  const fileName = jsonFiles.value[index];
  try {
    const res = await $request.Get("/file/content", { file: fileName });
    if (res.code === 200) {
      selectedFile.value = { name: fileName, content: res.data };
    } else {
      console.error("获取文件内容失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }
};

// 显示用户信息
const showUserInfo = () => {
  selectedFileIndex.value = null;
  rightContent.value = "userInfo";
  localStorage.setItem("rightContent", "userInfo");
};

// 登出
const handleLogout = () => {
  userStore.logout();
  router.push("/admin/login");
};

// 保存文件
const getContentObject = () => {
  if (!selectedFile.value) return {};
  if (typeof selectedFile.value.content === "string") {
    try {
      return JSON.parse(selectedFile.value.content);
    } catch {
      return {};
    }
  }
  return selectedFile.value.content;
};

const saveFile = async () => {
  if (selectedFileIndex.value === null || !selectedFile.value) return;

  const fileName = jsonFiles.value[selectedFileIndex.value];
  try {
    const res = await $request.Post("/file/update", {
      file: fileName.split(".")[0],
      data: getContentObject(),
    });
    if (res.code === 200) {
      $toast?.success("修改成功");
    } else {
      $toast?.error("修改失败");
    }
  } catch (err) {
    console.error("保存文件失败:", err);
  }
};

// 初始化
onMounted(async () => {
  try {
    const res = await $request.Get("/file/list");
    if (res.code === 200) jsonFiles.value = res.data;

    // 恢复右侧内容
    const savedRightContent = localStorage.getItem("rightContent");
    if (savedRightContent === "userInfo") {
      rightContent.value = "userInfo";
    } else {
      // 如果是json，则读取选中文件
      const savedIndex = localStorage.getItem("selectedFileIndex");
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex);
        if (!isNaN(idx) && idx >= 0 && idx < jsonFiles.value.length) {
          await selectFile(idx);
        }
      }
    }

    const savedDark = localStorage.getItem("darkMode");
    isDarkMode.value = savedDark === "1";
  } catch (err) {
    console.error("初始化失败:", err);
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --accent: 240 3.7% 15.9%;
  --bg-primary: #f9fafb;
  --bg-secondary: #f5f5f5;
  --bg-sidebar: #f8f9fa;
  --text-primary: #000000;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --transition-speed: 0.3s;
}

.dark-mode {
  --accent: 240 3.7% 15.9%;
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-sidebar: #665a5a;
  --text-primary: #ffffff;
  --text-secondary: #a3a3a3;
  --border-color: #404040;
}
</style>
<style scoped>
.layout-container {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color var(--transition-speed), color var(--transition-speed);
  line-height: 1.5;
  min-height: 100vh;
  width: 100vw;
}

.app-container {
  display: flex;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  height: 100vh;
}

/* 高亮选中左侧导航 */
.nav-link.selected {
  background-color: #0fbc86;
  color: #ffffff;
}

/* 保存按钮样式 */
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

/* 侧边栏样式 */
.sidebar {
  display: flex;
  flex-direction: column;
  /* background-color: var(--bg-sidebar); */
  width: 250px;
  min-width: 250px;
  padding: 1rem;
  transition: width var(--transition-speed);
  overflow: hidden;
  position: relative;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  margin-bottom: 2rem;
  margin-top: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  padding: 0.25rem 0;
}

.logo-icon {
  width: 24px;
  height: 20px;
  background-color: var(--text-primary);
  border-radius: 8px 8px 4px 8px;
  flex-shrink: 0;
}

.logo-text {
  transition: opacity var(--transition-speed);
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all var(--transition-speed);
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--text-primary);
  transform: translateX(4px);
}

.nav-link i {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-link-text {
  transition: opacity var(--transition-speed);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  margin-top: auto;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  cursor: pointer;
}

/* 移动端侧边栏样式 */
.mobile-sidebar-toggle {
  display: none;
  padding: 1rem;
  background-color: var(--bg-sidebar);
  justify-content: flex-end;
  width: 100%;
}

.mobile-sidebar-toggle i {
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
  z-index: 100;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform var(--transition-speed);
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-sidebar-close {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  font-size: 1.5rem;
  color: var(--text-primary);
  cursor: pointer;
}

/* 主内容区域样式 */
.dashboard {
  flex-grow: 1;
  background-color: var(--bg-primary);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 动画 */
@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* 主题切换按钮 */
.theme-toggle {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-speed);
  z-index: 1000;
}

.theme-toggle:hover {
  background-color: var(--border-color);
}

.theme-toggle i {
  font-size: 1.25rem;
  color: var(--text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
    height: auto;
    margin: 1rem;
  }

  .sidebar {
    display: none;
  }

  .mobile-sidebar-toggle {
    display: flex;
  }

  .dashboard {
    border-radius: 0 0 12px 12px;
  }

  .stats-row {
    flex-direction: column;
  }

  .content-row {
    flex-direction: column;
  }
}
</style>
