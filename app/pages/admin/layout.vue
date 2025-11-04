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
      <div class="sidebar" :class="{ collapsed: !sidebarOpen }">
        <div class="sidebar-header">
          <!-- <a href="#" class="logo">
            <div class="logo-icon"></div>
            <span class="logo-text" v-show="sidebarOpen">Acet Labs</span>
          </a> -->
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
          <div class="user-avatar">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="用户头像"
            />
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
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="用户头像"
            />
          </div>
          <span class="user-name">LOG OUT</span>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="dashboard">
        <div class="content-head">
          <p class="text-2xl" v-if="selectedFile">{{ selectedFile.name }} 内容</p>
          <button v-if="selectedFile" @click="saveFile" class="save-btn">保存</button>
        </div>

        <vue-json-pretty
          v-if="selectedFile"
          :deep="3"
          selectableType="single"
          editableTrigger="dblclick"
          :showSelectController="false"
          :highlightMouseoverNode="true"
          path="res"
          v-model:data="selectedFile.content"
          :showLength="true"
          :showIcon="true"
          :editable="true"
          :showLineNumber="true"
          :theme="isDarkMode ? 'dark' : 'light'"
        >
          <template #value="{ value, editing, updateValue }">
            <textarea
              v-if="editing"
              :value="value"
              @input="updateValue($event.target.value)"
              style="
                width: 100%;
                min-height: 30px;
                padding: 3px 8px;
                box-sizing: border-box;
              "
            ></textarea>
            <span v-else>{{ value }}</span>
          </template>
        </vue-json-pretty>

        <JsonEditorVue
          v-if="selectedFile"
          v-model="selectedFile.content"
          :mode="'tree'"
          :search="true"
          :indentation="2"
          :history="true"
          :theme="darkMode ? 'dark' : 'light'"
        />

        <p v-else>请选择左侧的 JSON 文件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { useRouter } from "vue-router";
import { useUserStore } from "~/stores/pinia";
import JsonEditorVue from "json-editor-vue";

const sidebarOpen = ref(true);
const mobileSidebarOpen = ref(false);
const isDarkMode = ref(false);
const selectedFileIndex = ref<number | null>(null);
const selectedFile = ref<{ name: string; content: any } | null>(null);
const jsonFiles = ref<string[]>([]);
const userStore = useUserStore();
const router = useRouter();

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value ? "1" : "0");
};

const jumpHome = () => {
  router.push("/");
};

// 移动端侧边栏切换
const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value;
};

// 选择文件
const selectFile = async (index: number) => {
  if (index < 0 || index >= jsonFiles.value.length) return;
  selectedFileIndex.value = index;
  localStorage.setItem("selectedFileIndex", index.toString());

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

const handleLogout = () => {
  userStore.logout();
  // 还可以跳转到登录页
  router.push("/admin/login");
};

const saveFile = async () => {
  if (
    selectedFileIndex.value &&
    (selectedFileIndex.value < 0 || selectedFileIndex.value >= jsonFiles.value.length)
  )
    return;

  const fileName = jsonFiles.value[selectedFileIndex.value];
  console.log(fileName, selectedFile.value.content);

  try {
    const res = await $request.Post("/file/update", {
      file: fileName.split(".")[0],
      data: selectedFile.value.content,
    });
    if (res.code === 200) {
      $toast?.success("修改成功");
    } else {
      $toast?.error("修改失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }
};

// 初始化
onMounted(async () => {
  try {
    const res = await $request.Get("/file/list");
    if (res.code === 200) jsonFiles.value = res.data;

    const savedIndex = localStorage.getItem("selectedFileIndex");
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex);
      if (!isNaN(idx) && idx >= 0 && idx < jsonFiles.value.length) {
        await selectFile(idx);
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
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --bg-sidebar: #f8f9fa;
  --text-primary: #000000;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --transition-speed: 0.3s;
}

.dark-mode {
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-sidebar: #262626;
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
  background-color: var(--bg-sidebar);
  width: 250px;
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

.content-head {
  display: flex;
  justify-content: space-between;
}

.stats-row {
  display: flex;
  gap: 1rem;
}

.stat-card {
  flex: 1;
  height: 80px;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  animation: pulse 2s infinite;
}

.content-row {
  display: flex;
  gap: 1rem;
  flex-grow: 1;
}

.content-card {
  flex: 1;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  animation: pulse 2s infinite;
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
