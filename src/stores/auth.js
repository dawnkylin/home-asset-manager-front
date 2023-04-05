import { defineStore } from "pinia";
import { setLocalStorage, getLocalStorage } from "@utils/storage";

// 第一个参数是你的应用中 Store 的唯一 ID
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getLocalStorage("token") || "",
    user: null,
  }),
  actions: {
    login(token, user) {
      this.token = token;
      this.user = user;
      setLocalStorage("token", token);
      setLocalStorage("user", user);
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
  },
});
