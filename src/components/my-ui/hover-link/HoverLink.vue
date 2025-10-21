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

.hover-link .underline {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: #78f2ab;
  transition: width 0.3s ease, left 0.3s ease;
}

.hover-link:hover .underline {
  width: 100%;
  right: 0;
}

.hover-link:not(:hover) .underline {
  width: 0;
  right: 100%;
}
</style>
