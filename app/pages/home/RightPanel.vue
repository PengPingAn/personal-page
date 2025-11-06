<template>
  <div class="right-panel">
    <GitHubHeatmap :data="heatmapData"> </GitHubHeatmap>
    <MBTICharacterCard
      mbti="INFJ"
      name="提倡者"
      description="内向、理想主义，善于理解他人，追求精神世界。"
      :traits="[
        { label: 'I/E', value: 90, tooltip: '倾向内向 (I) 与外向 (E) 的差异' },
        { label: 'N/S', value: 80, tooltip: '直觉 (N) 与感官 (S) 的差异' },
        { label: 'F/T', value: 70, tooltip: '情感 (F) 与思考 (T) 的差异' },
        { label: 'J/P', value: 60, tooltip: '判断 (J) 与知觉 (P) 的差异' },
      ]"
    />
    <div class="flex flex-col xl:flex-row gap-4">
      <PlanGoalList :data="myPlans" />
      <TechScroll />
    </div>

    <Card class="my-4">
      <template #default>
        <p class="my-4 text-xl text-center flex gap-2 justify-center text-[#FFF]">
          <span class="system-uicons--book-text"></span>
          近期的一些文章
        </p>
        <TimelineArticle></TimelineArticle>
        <div class="my-4 text-right">
          <HoverLink
            href="https://www.example.com"
            color="#FFF"
            text="还有更多，去看看？"
          />
        </div>
      </template>
    </Card>
    <div class="flex gap-4">
      <!-- 左侧列 -->
      <div class="">
        <Card
          style="height: 100%; width: 200px"
          class="group relative overflow-hidden bg-transparent border-0"
          :body-class="['justify-center', 'items-center', 'flex']"
        >
          <!-- 背景图片 -->
          <div
            class="absolute inset-0 bg-cover bg-center transition-filter duration-500 filter blur-sm group-hover:blur-0"
            :style="{
              backgroundImage:
                'url(https://q0.itc.cn/q_70/images03/20251001/344ea6c5614f4fb4b6930d0c4d779e1f.jpeg)',
            }"
          ></div>

          <!-- 文字层 -->
          <div
            class="relative z-10 flex flex-col justify-center items-center h-full text-center text-white"
          >
            <p class="flex flex-col items-center leading-none text-4xl">
              <span>现</span>
              <span>位</span>
              <span>于</span>
              <br />
              <span class="font-bold">广</span>
              <span class="font-bold">州</span>
              <span class="font-bold">市</span>
              <br />
              <span class="font-bold">天</span>
              <span class="font-bold">河</span>
              <span class="font-bold">区</span>
            </p>
          </div>
        </Card>
      </div>

      <!-- 右侧列 -->
      <div class="flex-[2] flex flex-col gap-4">
        <!-- 第一行：第二、三个卡片 -->
        <div class="flex gap-4">
          <Card class="flex-[3] h-48">
            <div
              class="relative sayText quote-text m-8 text-4xl text-[#FFF] flex justify-center"
            >
              <div>
                <span style="color: #36ddad">纵有疾风起</span>
                <br />

                <span>人生不言弃</span>
              </div>
            </div>
          </Card>

          <Card class="flex-[2] h-48">
            <div class="flex justify-center items-center h-full">
              <img
                src="https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1761120649_1e91044c.gif"
                alt=""
                class="max-h-full"
              />
            </div>
          </Card>
        </div>

        <div class="flex gap-4">
          <div class="w-fit">
            <Card class="h-full w-full" bg-color="#000">
              <!-- <PixelatedCanvas
                :height="200"
                :width="150"
                src="https://img1.baidu.com/it/u=2691502892,2994512042&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=676"
              /> -->
              <ParticleImage
                :canvas-width="150"
                :canvas-height="280"
                :particle-size="1"
                image-src="https://img2.baidu.com/it/u=119787490,3418968819&fm=253&app=138&f=JPEG?w=800&h=1584"
                :responsive-width="true"
                :strength="0.1"
                :radius="900"
              />
            </Card>
          </div>
          <div class="w-full">
            <Card class="max-h-[320px] h-[320px]" title="最近发生的事">
              <AnimatedList class="h-[260px]">
                <template #default>
                  <Notification
                    v-for="(item, idx) in notifications"
                    :key="idx"
                    :title="item.title"
                    :description="item.description"
                    :time="item.time"
                    :type="item.type"
                    :userName="item.userName"
                    :userHead="item.userHead"
                  />
                </template>
              </AnimatedList>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-4 my-4">
      <div class="w-[30rem]">
        <Card class="h-80 w-full" bg-color="#000" title="精彩留言">
          <RollingMessage ref="rollingMessageRef"></RollingMessage>
        </Card>
      </div>
      <div class="w-full">
        <Card class="h-80" title="写点什么吧~">
          <LeaveMessageForm @submit="submit"></LeaveMessageForm>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import TimelineArticle from "./component/TimelineArticle.vue";
import RollingMessage from "./component/RollingMessage.vue";

const rollingMessageRef = ref<any>(null);
const myPlans = [
  { id: 1, content: "写一篇技术文章", completed: true },
  { id: 2, content: "整理笔记", completed: true },
  { id: 3, content: "复习 Vue 3", completed: false },
  { id: 4, content: "完成一个个人主页", completed: false },
  {
    id: 5,
    content: "提高后端技术栈深度与广度",
    completed: false,
  },
];

const notifications = [
  {
    description: "",
    time: "15m ago",
    type: 1,
    title: "平淡和忙碌的交织",
    userName: "",
    userHead: "",
  },
  {
    description: "忙碌但很充实，感觉很有意义",
    time: "10m ago",
    type: 2,
    title: "平淡和忙碌的交织",
    userName: "Arthals",
    userHead:
      "https://q9.itc.cn/q_70/images03/20250116/a1e4c3e61644486a8204fd68216e5b56.jpeg",
  },
  {
    description: "还不错的项目，很有个性",
    time: "10m ago",
    type: 3,
    title: "",
    userName: "XINYAO QI",
    userHead:
      "https://q3.itc.cn/q_70/images03/20240426/5ec053593225431c8c82415c237ce1a9.jpeg",
  },
  {
    description: "",
    time: "10m ago",
    type: 4,
    title: "人生何处不青山",
    userName: "平安",
    userHead:
      "https://gitee.com/leefugui/love-world-image-service/raw/master/images/20250928/1760522936_bb6d63b9.jpg",
  },
  {
    description: "",
    time: "5m ago",
    type: 1,
    title: "收获满满的一天",
    userName: "Li Hua",
    userHead: "",
  },
  {
    description: "尝试了新的方法，结果不错",
    time: "4m ago",
    type: 2,
    title: "实验新方法",
    userName: "Chen Wei",
    userHead: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    description:
      "网站内容真是丰满，坚持带给人的震撼，无意间看到顶上头像旁边动起来了，还是相当有意思 😆",
    time: "3m ago",
    type: 3,
    title: "",
    userName: "Zhang San",
    userHead: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    description: "",
    time: "2m ago",
    type: 4,
    title: "2025 中秋",
    userName: "",
    userHead: "",
  },
  {
    description: "",
    time: "1m ago",
    type: 1,
    title: "小项目完成",
    userName: "",
    userHead: "",
  },
  {
    description: "今晚的晚餐很美味",
    time: "Just now",
    type: 2,
    title: "美味晚餐",
    userName: "Sun Qian",
    userHead: "https://randomuser.me/api/portraits/women/51.jpg",
  },
];

const heatmapData = {
  "2024-10-16 00:00:00": 9,
  "2024-10-17 00:00:00": 2,
  "2024-10-18 00:00:00": 1,
  "2024-10-23 00:00:00": 4,
  "2024-10-24 00:00:00": 3,
  "2024-10-25 00:00:00": 1,
  "2024-10-28 00:00:00": 3,
  "2024-10-29 00:00:00": 3,
  "2024-10-30 00:00:00": 1,
  "2024-10-31 00:00:00": 2,
  "2024-11-01 00:00:00": 3,
  "2024-11-04 00:00:00": 11,
  "2024-11-05 00:00:00": 2,
  "2024-11-06 00:00:00": 2,
  "2024-11-08 00:00:00": 2,
  "2024-11-11 00:00:00": 4,
  "2024-11-12 00:00:00": 4,
  "2024-11-13 00:00:00": 2,
  "2024-11-14 00:00:00": 1,
  "2024-11-15 00:00:00": 1,
  "2024-11-16 00:00:00": 3,
  "2024-11-18 00:00:00": 2,
  "2024-11-19 00:00:00": 4,
  "2024-11-20 00:00:00": 2,
  "2024-11-21 00:00:00": 1,
  "2024-11-22 00:00:00": 1,
  "2024-11-25 00:00:00": 3,
  "2024-11-26 00:00:00": 1,
  "2024-12-02 00:00:00": 1,
  "2024-12-04 00:00:00": 3,
  "2024-12-05 00:00:00": 2,
  "2024-12-06 00:00:00": 5,
  "2024-12-09 00:00:00": 1,
  "2024-12-10 00:00:00": 5,
  "2024-12-11 00:00:00": 2,
  "2024-12-13 00:00:00": 3,
  "2024-12-16 00:00:00": 2,
  "2024-12-18 00:00:00": 1,
  "2024-12-19 00:00:00": 2,
  "2024-12-20 00:00:00": 1,
  "2024-12-24 00:00:00": 2,
  "2024-12-25 00:00:00": 2,
  "2024-12-26 00:00:00": 2,
  "2024-12-27 00:00:00": 4,
  "2024-12-30 00:00:00": 1,
  "2025-01-07 00:00:00": 1,
  "2025-01-15 00:00:00": 1,
  "2025-01-24 00:00:00": 1,
  "2025-02-05 00:00:00": 1,
  "2025-02-06 00:00:00": 10,
  "2025-02-07 00:00:00": 5,
  "2025-02-08 00:00:00": 7,
  "2025-02-14 00:00:00": 4,
  "2025-02-16 00:00:00": 1,
  "2025-02-17 00:00:00": 1,
  "2025-02-18 00:00:00": 2,
  "2025-02-19 00:00:00": 5,
  "2025-02-20 00:00:00": 1,
  "2025-02-21 00:00:00": 2,
  "2025-02-22 00:00:00": 6,
  "2025-02-27 00:00:00": 2,
  "2025-02-28 00:00:00": 2,
  "2025-03-01 00:00:00": 4,
  "2025-03-02 00:00:00": 2,
  "2025-03-03 00:00:00": 3,
  "2025-03-04 00:00:00": 4,
  "2025-03-05 00:00:00": 4,
  "2025-03-06 00:00:00": 1,
  "2025-03-07 00:00:00": 2,
  "2025-03-08 00:00:00": 2,
  "2025-03-10 00:00:00": 3,
  "2025-03-11 00:00:00": 3,
  "2025-03-12 00:00:00": 4,
  "2025-03-13 00:00:00": 6,
  "2025-03-14 00:00:00": 4,
  "2025-03-17 00:00:00": 1,
  "2025-03-18 00:00:00": 1,
  "2025-03-19 00:00:00": 3,
  "2025-03-20 00:00:00": 1,
  "2025-03-21 00:00:00": 4,
  "2025-03-22 00:00:00": 1,
  "2025-03-23 00:00:00": 4,
  "2025-03-24 00:00:00": 2,
  "2025-03-25 00:00:00": 4,
  "2025-03-26 00:00:00": 3,
  "2025-03-27 00:00:00": 2,
  "2025-03-28 00:00:00": 3,
  "2025-04-14 00:00:00": 1,
  "2025-04-17 00:00:00": 4,
  "2025-04-21 00:00:00": 3,
  "2025-04-23 00:00:00": 1,
  "2025-04-24 00:00:00": 2,
  "2025-04-25 00:00:00": 2,
  "2025-04-27 00:00:00": 3,
  "2025-04-29 00:00:00": 1,
  "2025-04-30 00:00:00": 1,
  "2025-05-08 00:00:00": 1,
  "2025-05-09 00:00:00": 6,
  "2025-05-12 00:00:00": 2,
  "2025-05-13 00:00:00": 1,
  "2025-05-14 00:00:00": 3,
  "2025-05-15 00:00:00": 2,
  "2025-05-16 00:00:00": 4,
  "2025-05-19 00:00:00": 3,
  "2025-05-20 00:00:00": 2,
  "2025-05-21 00:00:00": 2,
  "2025-05-22 00:00:00": 1,
  "2025-05-23 00:00:00": 3,
  "2025-05-26 00:00:00": 6,
  "2025-05-27 00:00:00": 5,
  "2025-05-28 00:00:00": 3,
  "2025-05-29 00:00:00": 3,
  "2025-05-30 00:00:00": 3,
  "2025-05-31 00:00:00": 1,
  "2025-06-01 00:00:00": 1,
  "2025-06-02 00:00:00": 3,
  "2025-06-03 00:00:00": 4,
  "2025-06-04 00:00:00": 2,
  "2025-06-05 00:00:00": 3,
  "2025-06-06 00:00:00": 2,
  "2025-06-08 00:00:00": 1,
  "2025-06-09 00:00:00": 5,
  "2025-06-10 00:00:00": 2,
  "2025-06-11 00:00:00": 3,
  "2025-06-12 00:00:00": 10,
  "2025-06-13 00:00:00": 6,
  "2025-06-14 00:00:00": 3,
  "2025-06-15 00:00:00": 2,
  "2025-06-16 00:00:00": 7,
  "2025-06-17 00:00:00": 11,
  "2025-06-18 00:00:00": 4,
  "2025-06-19 00:00:00": 16,
  "2025-06-20 00:00:00": 7,
  "2025-06-21 00:00:00": 1,
  "2025-06-23 00:00:00": 6,
  "2025-06-24 00:00:00": 7,
  "2025-06-25 00:00:00": 4,
  "2025-06-26 00:00:00": 2,
  "2025-06-27 00:00:00": 7,
  "2025-06-28 00:00:00": 2,
  "2025-06-29 00:00:00": 1,
  "2025-06-30 00:00:00": 3,
  "2025-07-01 00:00:00": 2,
  "2025-07-02 00:00:00": 7,
  "2025-07-03 00:00:00": 5,
  "2025-07-04 00:00:00": 3,
  "2025-07-05 00:00:00": 1,
  "2025-07-07 00:00:00": 3,
  "2025-07-08 00:00:00": 2,
  "2025-07-09 00:00:00": 4,
  "2025-07-10 00:00:00": 2,
  "2025-07-11 00:00:00": 2,
  "2025-07-13 00:00:00": 3,
  "2025-07-14 00:00:00": 1,
  "2025-07-15 00:00:00": 3,
  "2025-07-16 00:00:00": 3,
  "2025-07-17 00:00:00": 2,
  "2025-07-18 00:00:00": 2,
  "2025-07-21 00:00:00": 2,
  "2025-07-22 00:00:00": 1,
  "2025-07-23 00:00:00": 3,
  "2025-07-24 00:00:00": 4,
  "2025-07-25 00:00:00": 2,
  "2025-07-28 00:00:00": 5,
  "2025-07-29 00:00:00": 1,
  "2025-07-30 00:00:00": 3,
  "2025-07-31 00:00:00": 1,
  "2025-08-01 00:00:00": 3,
  "2025-08-04 00:00:00": 2,
  "2025-08-05 00:00:00": 1,
  "2025-08-06 00:00:00": 2,
  "2025-08-07 00:00:00": 1,
  "2025-08-08 00:00:00": 2,
  "2025-08-11 00:00:00": 1,
  "2025-08-12 00:00:00": 2,
  "2025-08-13 00:00:00": 25,
  "2025-08-14 00:00:00": 8,
  "2025-08-15 00:00:00": 3,
  "2025-08-19 00:00:00": 45,
  "2025-08-20 00:00:00": 4,
  "2025-08-21 00:00:00": 2,
  "2025-08-22 00:00:00": 2,
  "2025-08-25 00:00:00": 2,
  "2025-08-26 00:00:00": 1,
  "2025-08-27 00:00:00": 5,
  "2025-08-28 00:00:00": 3,
  "2025-08-29 00:00:00": 2,
  "2025-09-01 00:00:00": 1,
  "2025-09-03 00:00:00": 5,
  "2025-09-04 00:00:00": 7,
  "2025-09-05 00:00:00": 2,
  "2025-09-08 00:00:00": 2,
  "2025-09-09 00:00:00": 2,
  "2025-09-10 00:00:00": 3,
  "2025-09-12 00:00:00": 8,
  "2025-09-15 00:00:00": 9,
  "2025-09-16 00:00:00": 4,
  "2025-09-17 00:00:00": 1,
  "2025-09-18 00:00:00": 3,
  "2025-09-19 00:00:00": 2,
  "2025-09-22 00:00:00": 2,
  "2025-09-23 00:00:00": 2,
  "2025-09-24 00:00:00": 2,
  "2025-09-25 00:00:00": 3,
  "2025-09-26 00:00:00": 5,
  "2025-09-27 00:00:00": 1,
  "2025-09-28 00:00:00": 8,
  "2025-09-29 00:00:00": 9,
  "2025-10-09 00:00:00": 1,
  "2025-10-11 00:00:00": 3,
  "2025-10-13 00:00:00": 1,
  "2025-10-14 00:00:00": 1,
  "2025-10-15 00:00:00": 11,
  "2025-10-16 00:00:00": 1,
};

const submit = async (val: any) => {
  try {
    const res = await $request.Post("/message/add_message", val);
    if (res.code === 200) {
      $toast?.success("留言成功");
      await rollingMessageRef.value.getMessage();
    } else {
      $toast?.error("留言失败");
    }
  } catch (err) {
    console.error("获取文件内容失败:", err);
  }
};
</script>

<style scoped>
.right-panel {
  flex: 1;
}

.sayText {
  padding: 4px 4px;
  transition: background-color 0.3s ease, border-radius 0.3s ease;
  position: relative;
}

.quote-text {
  position: relative;
}
.quote-text::before {
  content: "“";
  position: absolute;
  left: 0%;
  font-size: 8rem;
  color: rgba(173, 172, 172, 0.38); /* 0.8透明度 */
  pointer-events: none;
  user-select: none;
  font-family: fantasy;
}
</style>
