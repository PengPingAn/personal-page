<template>
  <MenuComponent></MenuComponent>
  <StatisticsTimeline
    title="热力图的千篇一律，&#10;不如做成了时间线?"
    :timelineData="timelineData"
  />
</template>

<script setup lang="ts">
const timelineData = [
  {
    label: "2025.01",
    total: 3,
    daily: [
      { day: 2, title: "元旦" },
      { day: 10, title: "总结" },
      { day: 18, title: "随笔" },
    ],
  },
  {
    label: "2025.02",
    total: 5,
    daily: [
      { day: 5, title: "春节快乐" },
      { day: 6, title: "春节快乐！！！！" },
      { day: 7, title: "节后复盘" },
      { day: 10, title: "文章A" },
      { day: 12, title: "文章B" },
    ],
  },
  {
    label: "2025.03",
    total: 3,
    daily: [
      { day: 8, title: "新计划" },
      { day: 10, title: "新UI" },
      { day: 20, title: "进度报告" },
    ],
  },
  {
    label: "2025.04",
    total: 6,
    daily: [
      { day: 1, title: "愚人节" },
      { day: 2, title: "技巧" },
      { day: 7, title: "Vue3" },
      { day: 7, title: "TS" },
      { day: 20, title: "回顾" },
      { day: 25, title: "随笔" },
    ],
  },
  {
    label: "2025.05",
    total: 4,
    daily: [
      { day: 2, title: "劳动节" },
      { day: 5, title: "组件优化" },
      { day: 10, title: "性能调优" },
      { day: 30, title: "总结" },
    ],
  },
  {
    label: "2025.06",
    total: 3,
    daily: [
      { day: 1, title: "UI改版" },
      { day: 9, title: "Bug修复" },
      { day: 22, title: "发布" },
    ],
  },
  {
    label: "2025.07",
    total: 5,
    daily: [
      { day: 3, title: "新主题" },
      { day: 10, title: "Vue组件库" },
      { day: 15, title: "前端思考" },
      { day: 15, title: "技术路线" },
      { day: 28, title: "复盘" },
    ],
  },
  {
    label: "2025.08",
    total: 1,
    daily: [{ day: 16, title: "轻改版" }],
  },
  {
    label: "2025.09",
    total: 4,
    daily: [
      { day: 1, title: "开学季" },
      { day: 5, title: "新功能" },
      { day: 17, title: "小记" },
      { day: 26, title: "性能优化" },
    ],
  },
  {
    label: "2025.10",
    total: 3,
    daily: [
      { day: 2, title: "国庆" },
      { day: 8, title: "优化" },
      { day: 20, title: "分享" },
    ],
  },
  {
    label: "2025.11",
    total: 2,
    daily: [
      { day: 7, title: "收尾" },
      { day: 12, title: "总结" },
    ],
  },
  {
    label: "2025.12",
    total: 3,
    daily: [
      { day: 5, title: "年终" },
      { day: 15, title: "收官" },
      { day: 25, title: "圣诞" },
    ],
  },
];
</script>
