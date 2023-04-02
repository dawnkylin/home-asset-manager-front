import { defineStore } from "pinia";
import { setLocalStorageWithExpiration, getLocalStorageWithExpiration } from "@utils/storage";

// 第一个参数是你的应用中 Store 的唯一 ID
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getLocalStorageWithExpiration("token") || "",
    user: null,
  }),
  actions: {
    login(token, user) {
      this.token = token;
      this.user = user;
      // 60分钟过期，实际项目中不建议在客户端设置token过期时间，应该在服务端设置，客户端只需要获取服务端返回的token即可
      setLocalStorageWithExpiration("token", token, 60);
    },
    logout() {
      this.token = "";
      localStorage.removeItem("token");
    },
  },
  getters: {
    isAuthenticated: (state) => {
      // !!判断state.token是否存在
      return !!state.token;
    },
  },
});
