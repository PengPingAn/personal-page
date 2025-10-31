// stores/user.ts
import { defineStore } from "pinia";
import { useCookie } from "#app";

interface UserState {
  token: string;
  username: string;
  personal: { name: string; bio: string; projects: any[] } | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: useCookie("web-token").value || "",
    username: "",
    personal: null,
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
    setPersonal(personal: UserState["personal"]) {
      this.personal = personal;
    },
    logout() {
      this.reset();
      // 清空 cookie
      useCookie("web-token").value = "";
      useCookie("username").value = "";
    },
    reset() {
      this.$reset(); // ✅ Pinia 自带的方法，重置 state 为初始值
    },
  },
  persist: true, // ✅ 现在可以用了
});
