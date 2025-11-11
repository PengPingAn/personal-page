// stores/user.ts
import { defineStore } from "pinia";
import { useCookie } from "#app";

interface UserState {
  token: string;
  username: string;
  head: string;
}
interface MessageInfo {
  name: string;
  email: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: useCookie("web-token").value || "",
    username: "",
    head: "",
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      useCookie("web-token").value = token;
    },
    setUsername(username: string) {
      this.username = username;
      useCookie("username").value = username;
    },
    setHead(head: string) {
      this.head = head;
      useCookie("head").value = head;
    },
    logout() {
      this.reset();
      // 清空 cookie
      useCookie("web-token").value = "";
      useCookie("username").value = "";
      useCookie("head").value = "";
    },
    reset() {
      this.$reset(); // ✅ Pinia 自带的方法，重置 state 为初始值
    },
  },
  persist: true, // ✅ 现在可以用了
});

export const useMessageStore = defineStore("message-info", {
  state: (): MessageInfo => ({
    name: "",
    email: "",
  }),
  actions: {
    setMessageInfo(name: string, email: string) {
      this.name = name;
      this.email = email;
      useCookie("message-info-name").value = name;
      useCookie("message-info-email").value = email;
    },
  },
  persist: true, // 开启持久化
});
