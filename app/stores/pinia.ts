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
    username: useCookie("username").value || "",
    head: useCookie("head").value || "",
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      setCookieWithOption("web-token", token, { days: 7 });
    },
    setUsername(username: string) {
      this.username = username;
      setCookieWithOption("username", username, { days: 7 });
    },
    setHead(head: string) {
      this.head = head;
      setCookieWithOption("head", head, { days: 7 });
    },
    logout() {
      this.reset();
      ["web-token", "username", "head"].forEach((name) =>
        setCookieWithOption(name, "", { days: -1 })
      );
    },
    reset() {
      this.$reset();
    },
  },
  persist: true,
});

export const useMessageStore = defineStore("message-info", {
  state: (): MessageInfo => ({
    name: useCookie("message-info-name").value || "",
    email: useCookie("message-info-email").value || "",
  }),
  actions: {
    setMessageInfo(name: string, email: string) {
      this.name = name;
      this.email = email;
      // permanent = true
      setCookieWithOption("message-info-name", name, { permanent: true });
      setCookieWithOption("message-info-email", email, { permanent: true });
    },
  },
  persist: true,
});

function setCookieWithOption(
  name: string,
  value: string,
  options?: { days?: number; permanent?: boolean }
) {
  if (options?.permanent) {
    // 设置为长期 Cookie，几乎等于永久（10 年）
    useCookie(name, { maxAge: 60 * 60 * 24 * 365 * 10 }).value = value;
  } else {
    const days = options?.days ?? 7;
    useCookie(name, { maxAge: 60 * 60 * 24 * days }).value = value;
  }
}
