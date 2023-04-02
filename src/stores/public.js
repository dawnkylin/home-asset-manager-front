import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const usePageStore = defineStore("page", {
  state: () => ({
    isAsideVisible: true,
    route: useRoute(),
    countdown: 0,
  }),
  getters: {
    getCurrentPath: (state) => {
      const currentPath = state.route.path.split("/").filter((path) => path !== "");
      return currentPath.map((path) => {
        const matchedRoute = state.route.matched.find((route) => route.path === "/" + path);
        return {
          path: "/" + path,
          title: matchedRoute ? matchedRoute.meta.title : "",
        };
      });
    },
  },
});
