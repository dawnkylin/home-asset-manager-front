import routes from "./routes";
import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "@stores/auth";

/**
 * this.$route.params.
 * this.$router.push(path)
 * 要在 setup 函数中访问路由，请调用 useRouter 或 useRoute 函数
 */

const router = createRouter({
  // 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式
  history: createWebHashHistory(),
  routes,
});
// “guestOnly”表示只有未登录用户才能访问，“requiresAuth”表示只有已登录用户才能访问。
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 没登录就跳去登录页面
    if (!authStore.isAuthenticated) {
      next({ name: "login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guestOnly)) {
    // 已登录就跳去主页
    if (authStore.isAuthenticated) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
