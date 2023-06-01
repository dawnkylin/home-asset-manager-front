import routes from "./routes";
import { createRouter, createWebHashHistory } from "vue-router";
import axios from "@utils/request";
import { getLocalStorage, setLocalStorage } from "@utils/storage";
import { useAuthStore } from "@stores/auth";
import { get } from "lodash";

/**
 * this.$route.params.
 * this.$router.push(path)
 * 要在 setup 函数中访问路由，请调用 useRouter 或 useRoute 函数
 */

// 创建路由实例
const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes,
});

// “guestOnly”表示只有未登录用户才能访问，“requiresAuth”表示只有已登录用户才能访问。
router.beforeEach((to, from, next) => {
  //没有匹配到路由跳转到404页面
  if (to.matched.length === 0) {
    next({ name: "notFound" });
    return;
  }
  //无权访问跳转到403页面
  if (to.meta.role === "admin" && useAuthStore().user.role === "user") {
    next({ name: "forbidden" });
    return;
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 没登录就跳去登录页面
    axios.getRequest("/auth/isLogin").then((res) => {
      if (!res.success) {
        next({ name: "login" });
      } else {
        useAuthStore().user = getLocalStorage("user");
        if (useAuthStore().websocket == null) {
          useAuthStore().connectWebSocket();
        }
        //每次跳转重新获取用户信息
        // axios.getRequest("/account/getAccountDetail/" + getLocalStorage("user").id).then((res) => {
        //   if (res.code === 200) {
        //     useAuthStore().user = res.data;
        //     setLocalStorage("user", res.data);
        //   }
        // });
        next();
      }
    });
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    // 已登录就跳去主页
    axios.getRequest("/auth/isLogin").then((res) => {
      if (res.success) {
        useAuthStore().user = getLocalStorage("user");
        if (useAuthStore().websocket == null) {
          useAuthStore().connectWebSocket();
        }
        //每次跳转重新获取用户信息
        // axios.getRequest("/account/getAccountDetail/" + getLocalStorage("user").id).then((res) => {
        //   if (res.code === 200) {
        //     useAuthStore().user = res.data;
        //     setLocalStorage("user", res.data);
        //   }
        // });
        next({ name: "home" });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

export default router;
