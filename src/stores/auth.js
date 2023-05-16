import { defineStore } from "pinia";
import { setLocalStorage, getLocalStorage } from "@utils/storage";

// 第一个参数是你的应用中 Store 的唯一 ID
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: getLocalStorage("token") || "",
    user: null,
    websocket: null,
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
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      //关闭之前的WebSocket
      this.websocket.close();
    },
    //连接WebSocket
    connectWebSocket() {
      this.websocket = new WebSocket("ws://localhost:9999/ham/backend/websocket/" + this.user.id);
      this.websocket.onopen = function () {
        console.log("WebSocket连接成功");
      };
      this.websocket.onmessage = function (e) {
        console.log("WebSocket接收到消息");
      };
      this.websocket.onclose = function () {
        console.log("WebSocket连接关闭");
      };
      this.websocket.onerror = function () {
        console.log("WebSocket连接发生错误");
      };
    },
  },
});
