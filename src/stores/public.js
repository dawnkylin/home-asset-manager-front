import { defineStore } from "pinia";
import { useRoute } from "vue-router";

export const usePageStore = defineStore("page", {
  state: () => ({
    isCollapse: false,
    route: useRoute(),
    countdown: 0,
  }),
  getters: {
    getCurrentPath: (state) => {
      const matchedRoute = state.route.matched;
      return matchedRoute.map((route) => {
        return {
          name: route.name,
          title: route.meta.title,
        };
      }).filter((route) => {
        return route.name !== "index"&&route.name !== "home";
      });
    },
  },
});
