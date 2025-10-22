<template>
  <a :href="href" target="_blank" class="hover-link">
    {{ text }}
    <span class="underline"></span>
  </a>
</template>

<script setup>
defineProps({
  href: { type: String, required: true },
  text: { type: String, required: true },
});
</script>

<style scoped>
.hover-link {
  position: relative;
  display: inline-block;
  color: #000000;
  text-decoration: none;
  cursor: pointer;
}

/* underline 使用 scaleX 代替 width，避免跳动 */
.hover-link .underline {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 100%;
  background-color: #78f2ab;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

/* hover 时展开 underline */
.hover-link:hover .underline {
  transform: scaleX(1);
}
</style>
