import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path"; // 需要引入 path 模块
import Components from "unplugin-vue-components/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components/my-ui"], // 组件目录
      extensions: ["vue"],
      deep: true, // 递归搜索
      dts: true, // 生成类型声明文件
      resolvers: [],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // 关键配置
    },
  },
});
