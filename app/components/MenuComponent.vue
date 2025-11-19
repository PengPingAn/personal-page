<template>
  <header class="header-with-shadow" :class="{ 'has-shadow': shouldShowShadow }">
    <div class="blurred-background"></div>

    <div class="header-grid">
      <div class="header-left-button">
        <button
          class="header-action-button"
          @click="toggleDrawer"
          aria-label="Toggle menu"
        >
          <i class="icon-menu"></i>
        </button>
      </div>

      <div class="header-logo-area">
        <div class="logo-wrapper">
          <button @click="handleLogoClick" class="logo-button">
            <img src="" alt="Site Owner Avatar" class="site-avatar" />
          </button>
        </div>
      </div>

      <div class="header-center-area">
        <nav
          ref="navRef"
          class="desktop-nav"
          :class="{ 'hide-nav-bg': shouldHideNavBg }"
          :style="{ opacity: menuOpacity, visibility: menuVisibility }"
          @mousemove="handleMouseMove"
          @mouseleave="handleNavMouseLeave"
        >
          <div class="nav-spotlight" :style="{ background: spotlightBg }"></div>

          <div class="nav-menu-items">
            <div
              v-for="section in headerMenuConfig"
              :key="section.path"
              class="menu-item-wrapper"
              @mouseenter="handleMenuEnter(section)"
              @mouseleave="handleMenuLeave"
            >
              <component
                :is="section.path.startsWith('http') ? 'a' : 'a'"
                :href="section.path"
                :target="section.path.startsWith('http') ? '_blank' : undefined"
                class="menu-link"
                :class="{ active: isMenuActive(section) }"
                @click.prevent="handleNavClick(section.path)"
              >
                <span class="menu-content">
                  <!-- Improved icon animation with better timing -->
                  <transition name="icon-swap" mode="out-in">
                    <span
                      v-if="isMenuActive(section)"
                      class="menu-icon"
                      :key="getActiveIcon(section)"
                    >
                      {{ getActiveIcon(section) }}
                    </span>
                  </transition>
                  <span>{{ getActiveTitle(section) }}</span>
                </span>

                <!-- Enhanced active indicator with spotlight effect -->
                <transition name="spotlight-fade">
                  <span v-if="isMenuActive(section)" class="active-spotlight"></span>
                </transition>
              </component>

              <!-- Fixed popover visibility logic -->
              <transition name="popover-scale">
                <div
                  v-if="
                    activePopover === section &&
                    section.subMenu &&
                    section.subMenu.length > 0
                  "
                  class="submenu-popover"
                  @mouseenter="cancelPopoverClose"
                  @mouseleave="schedulePopoverClose"
                >
                  <a
                    v-for="subItem in section.subMenu"
                    :key="subItem.path"
                    :href="subItem.path"
                    class="submenu-link"
                    :target="subItem.path.startsWith('http') ? '_blank' : undefined"
                    @click.prevent="handleNavClick(subItem.path)"
                  >
                    <span v-if="subItem.icon" class="submenu-icon">{{
                      subItem.icon
                    }}</span>
                    <span>{{ subItem.title }}</span>
                  </a>
                </div>
              </transition>
            </div>
          </div>
        </nav>
      </div>

      <div class="header-right-area"></div>
    </div>

    <teleport to="body">
      <transition name="drawer">
        <div v-if="isDrawerOpen" class="drawer-overlay" @click="closeDrawer">
          <div class="drawer-panel" @click.stop>
            <div class="drawer-content-wrapper">
              <section
                v-for="(section, index) in headerMenuConfig"
                :key="section.path"
                class="drawer-section"
                :style="{ animationDelay: `${index * 60}ms` }"
              >
                <a
                  :href="section.path"
                  class="drawer-section-link"
                  @click.prevent="handleDrawerClick(section.path)"
                >
                  <span class="drawer-section-header">
                    <i class="drawer-section-icon">{{ section.icon }}</i>
                    <h2>{{ section.title }}</h2>
                  </span>
                </a>

                <ul
                  v-if="section.subMenu && section.subMenu.length > 0"
                  class="drawer-submenu-grid"
                >
                  <li v-for="sub in section.subMenu" :key="sub.path">
                    <a
                      :href="sub.path"
                      class="drawer-submenu-link"
                      @click.prevent="handleDrawerClick(sub.path)"
                    >
                      {{ sub.title }}
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface IHeaderMenu {
  title: string;
  path: string;
  type?: string;
  icon?: string;
  subMenu?: Omit<IHeaderMenu, "exclude">[];
  exclude?: string[];
}

const headerMenuConfig = ref<IHeaderMenu[]>([
  {
    title: "首页",
    path: "/",
    type: "Home",
    icon: "🏠",
    subMenu: [
      {
        title: "此站点",
        icon: "🔬",
        path: "/site",
      },
      {
        title: "关于站长",
        icon: "🔬",
        path: "/me",
      },
    ],
  },
  {
    title: "文稿",
    path: "/posts",
    type: "Post",
    icon: "📝",
    subMenu: [],
  },
  {
    title: "手记",
    type: "Note",
    path: "/notes",
    icon: "✍️",
    exclude: ["/notes/topics"],
  },
  {
    title: "思考",
    icon: "💭",
    path: "/thinking",
  },
  {
    title: "时光",
    icon: "⏱️",
    path: "/timeline",
    subMenu: [
      {
        title: "手记",
        icon: "✍️",
        path: "/timeline?type=note",
      },
      {
        title: "文稿",
        icon: "📖",
        path: "/timeline?type=post",
      },
      {
        title: "回忆",
        icon: "💫",
        path: "/timeline?memory=1",
      },
      {
        title: "专栏",
        path: "/notes/topics",
        icon: "📚",
      },
    ],
  },
  {
    title: "友链",
    icon: "🤝",
    path: "/friends",
  },
  {
    title: "更多",
    icon: "⚙️",
    path: "#",
    subMenu: [
      {
        title: "项目",
        icon: "🔬",
        path: "/projects",
      },
      {
        title: "一言",
        path: "/says",
        icon: "💬",
      },
      {
        title: "关于",
        icon: "ℹ️",
        path: "/about",
      },
      {
        title: "跃迁",
        icon: "🌍",
        path: "https://travel.moe/go.html",
      },
    ],
  },
]);

const currentPath = ref("/");
const isDrawerOpen = ref(false);
const activePopover = ref<IHeaderMenu | null>(null);
const scrollY = ref(0);
const shouldShowShadow = ref(false);
const navRef = ref<HTMLElement | null>(null);

const mouseX = ref(0);
const mouseY = ref(0);
const radius = ref(0);

let popoverCloseTimer: number | null = null;

const menuOpacity = computed(() => {
  if (scrollY.value < 100) return 1;
  if (scrollY.value > 200) return 0;
  return 1 - (scrollY.value - 100) / 100;
});

const menuVisibility = computed(() => {
  return menuOpacity.value === 0 ? "hidden" : "visible";
});

const shouldHideNavBg = computed(() => {
  return scrollY.value > 300;
});

const spotlightBg = computed(() => {
  return `radial-gradient(${radius.value}px circle at ${mouseX.value}px ${mouseY.value}px, rgba(168, 85, 247, 0.12) 0%, transparent 65%)`;
});

const handleScroll = () => {
  scrollY.value = window.scrollY;
  shouldShowShadow.value = scrollY.value > 50;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!navRef.value) return;
  const bounds = navRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - bounds.left;
  mouseY.value = e.clientY - bounds.top;
  radius.value = Math.sqrt(bounds.width ** 2 + bounds.height ** 2) / 2.5;
};

const handleNavMouseLeave = () => {
  schedulePopoverClose();
};

const isMenuActive = (section: IHeaderMenu): boolean => {
  if (currentPath.value === section.path) return true;

  if (
    currentPath.value.startsWith(`${section.path}/`) &&
    !section.exclude?.includes(currentPath.value)
  ) {
    return true;
  }

  if (section.subMenu) {
    return section.subMenu.some((sub) => currentPath.value === sub.path);
  }

  return false;
};

const getActiveSubItem = (section: IHeaderMenu) => {
  if (!section.subMenu) return null;
  return section.subMenu.find((sub) => currentPath.value === sub.path);
};

const getActiveTitle = (section: IHeaderMenu): string => {
  const activeSubItem = getActiveSubItem(section);
  return activeSubItem?.title ?? section.title;
};

const getActiveIcon = (section: IHeaderMenu): string => {
  const activeSubItem = getActiveSubItem(section);
  return activeSubItem?.icon ?? section.icon ?? "";
};

const handleMenuEnter = (section: IHeaderMenu) => {
  if (popoverCloseTimer) {
    clearTimeout(popoverCloseTimer);
    popoverCloseTimer = null;
  }

  if (section.subMenu && section.subMenu.length > 0) {
    activePopover.value = section;
  } else {
    activePopover.value = null;
  }
};

const handleMenuLeave = () => {
  schedulePopoverClose();
};

const schedulePopoverClose = () => {
  if (popoverCloseTimer) {
    clearTimeout(popoverCloseTimer);
  }
  popoverCloseTimer = window.setTimeout(() => {
    activePopover.value = null;
  }, 100);
};

const cancelPopoverClose = () => {
  if (popoverCloseTimer) {
    clearTimeout(popoverCloseTimer);
    popoverCloseTimer = null;
  }
};

const handleNavClick = (path: string) => {
  if (path === "#") return;

  if (path.startsWith("http")) {
    window.open(path, "_blank");
  } else {
    currentPath.value = path;
    console.log("[v0] Navigate to:", path);
  }
};

const handleLogoClick = () => {
  currentPath.value = "/";
  console.log("[v0] Navigate to home");
};

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
  if (isDrawerOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
  document.body.style.overflow = "";
};

const handleDrawerClick = (path: string) => {
  closeDrawer();
  handleNavClick(path);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "";
  if (popoverCloseTimer) {
    clearTimeout(popoverCloseTimer);
  }
});
</script>

<style scoped>
:root {
  --accent-color: rgb(168, 85, 247);
  --accent-rgb: 168, 85, 247;
}

.header-with-shadow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4.5rem;
  z-index: 50;
  transition: box-shadow 0.3s ease;
}

.header-with-shadow.has-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.blurred-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(250, 250, 250, 0.7),
    rgba(255, 255, 255, 0.9)
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@media (prefers-color-scheme: dark) {
  .blurred-background {
    background: linear-gradient(to bottom, rgba(24, 24, 27, 0.7), rgba(39, 39, 42, 0.9));
  }
}

.header-grid {
  position: relative;
  margin: 0 auto;
  height: 100%;
  max-width: 80rem;
  display: grid;
  grid-template-columns: 4.5rem auto 4.5rem;
  align-items: center;
  padding: 0 2rem;
}

@media (min-width: 1024px) {
  .header-grid {
    grid-template-columns: 4.5rem 1fr auto 4.5rem;
  }
}

.header-left-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

@media (min-width: 1024px) {
  .header-left-button {
    display: none;
  }
}

.header-logo-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.site-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.header-center-area {
  display: none;
  min-width: 0;
  flex: 1;
}

@media (min-width: 1024px) {
  .header-center-area {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.header-right-area {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.header-action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  color: rgb(82, 82, 91);
}

.header-action-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (prefers-color-scheme: dark) {
  .header-action-button {
    color: rgb(212, 212, 216);
  }

  .header-action-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
}

.icon-menu {
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12h18M3 6h18M3 18h18'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M3 12h18M3 6h18M3 18h18'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.desktop-nav {
  position: relative;
  border-radius: 9999px;
  background: linear-gradient(
    to bottom,
    rgba(250, 250, 250, 0.7),
    rgba(255, 255, 255, 0.9)
  );
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(24, 24, 27, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: all 0.2s;
  pointer-events: auto;
}

.desktop-nav.hide-nav-bg {
  background: none !important;
  box-shadow: none !important;
  border-color: transparent !important;
}

@media (prefers-color-scheme: dark) {
  .desktop-nav {
    background: linear-gradient(to bottom, rgba(24, 24, 27, 0.7), rgba(39, 39, 42, 0.9));
    border-color: rgba(250, 250, 250, 0.1);
  }
}

.nav-spotlight {
  position: absolute;
  inset: -1px;
  border-radius: 9999px;
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.desktop-nav:hover .nav-spotlight {
  opacity: 1;
}

.nav-menu-items {
  position: relative;
  display: flex;
  padding: 0 1rem;
  font-weight: 500;
  color: rgb(39, 39, 42);
}

@media (prefers-color-scheme: dark) {
  .nav-menu-items {
    color: rgb(228, 228, 231);
  }
}

.menu-item-wrapper {
  position: relative;
}

.menu-link {
  position: relative;
  display: block;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  transition: color 0.2s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.menu-link:hover {
  color: var(--accent-color);
  opacity: 0.8;
}

.menu-link.active {
  color: var(--accent-color);
}

.menu-content {
  display: flex;
  align-items: center;
  position: relative;
}

.menu-icon {
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
}

/* Enhanced active spotlight with gradient underline */
.active-spotlight {
  position: absolute;
  left: 50%;
  right: auto;
  bottom: -2px;
  width: 60%;
  height: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to right,
    transparent,
    rgba(var(--accent-rgb), 0.8) 20%,
    rgba(var(--accent-rgb), 1) 50%,
    rgba(var(--accent-rgb), 0.8) 80%,
    transparent
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(var(--accent-rgb), 0.5);
}

.submenu-popover {
  position: absolute;
  top: calc(100% + 0.625rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  min-width: 130px;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(24, 24, 27, 0.05);
  padding: 0.25rem;
}

@media (prefers-color-scheme: dark) {
  .submenu-popover {
    background: rgba(39, 39, 42, 0.95);
    border-color: rgba(250, 250, 250, 0.1);
  }
}

.submenu-link {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  transition: all 0.15s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 0.5rem;
}

.submenu-link:hover {
  background-color: rgba(var(--accent-rgb), 0.08);
  color: var(--accent-color);
}

.submenu-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.drawer-panel {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 90vw;
  max-width: 400px;
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

@media (prefers-color-scheme: dark) {
  .drawer-panel {
    background: rgb(39, 39, 42);
  }
}

.drawer-content-wrapper {
  margin-top: 3rem;
  max-height: 80dvh;
  padding: 1rem;
  padding-bottom: 6rem;
  overflow: auto;
}

.drawer-section {
  margin-bottom: 1rem;
  animation: drawerSlideIn 0.4s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
  opacity: 0;
}

/* Improved drawer animation with spring effect */
@keyframes drawerSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.drawer-section-link {
  display: block;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.drawer-section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 1.125rem;
}

.drawer-section-icon {
  font-style: normal;
  font-size: 1.25rem;
}

.drawer-submenu-grid {
  margin: 0.5rem 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.drawer-submenu-link {
  display: inline-block;
  padding: 0.5rem;
  text-decoration: none;
  color: rgb(113, 113, 122);
  transition: color 0.2s;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .drawer-submenu-link {
    color: rgb(161, 161, 170);
  }
}

.drawer-submenu-link:hover {
  color: var(--accent-color);
}

/* Improved drawer transition timing */
.drawer-enter-active {
  transition: opacity 0.25s ease-out;
}

.drawer-leave-active {
  transition: opacity 0.2s ease-in;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-panel {
  transition: transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.drawer-leave-active .drawer-panel {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1);
}

.drawer-enter-from .drawer-panel,
.drawer-leave-to .drawer-panel {
  transform: translateX(-100%);
}

/* Improved popover animation with scale and smooth timing */
.popover-scale-enter-active {
  transition: opacity 0.2s cubic-bezier(0.34, 1.3, 0.64, 1),
    transform 0.2s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.popover-scale-leave-active {
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
}

.popover-scale-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px) scale(0.96);
}

.popover-scale-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px) scale(0.98);
}

.popover-scale-enter-to,
.popover-scale-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateY(0) scale(1);
}

/* Smoother icon swap animation */
.icon-swap-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.3, 0.64, 1);
}

.icon-swap-leave-active {
  transition: all 0.15s ease-out;
}

.icon-swap-enter-from {
  opacity: 0;
  transform: translateY(-0.25rem) scale(0.8);
}

.icon-swap-leave-to {
  opacity: 0;
  transform: translateY(0.25rem) scale(0.8);
}

.icon-swap-enter-to,
.icon-swap-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Enhanced spotlight fade animation */
.spotlight-fade-enter-active {
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

.spotlight-fade-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.spotlight-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) scaleX(0.5);
}

.spotlight-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) scaleX(0.3);
}

.spotlight-fade-enter-to,
.spotlight-fade-leave-from {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}
</style>
