import { createApp } from "vue";

import App from "./App.vue";

import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import { createPinia } from "pinia";

const app = createApp(App);

const pinia = createPinia();

//启用vue的调试工具
app.config.devtools = true;

//过滤掉vue的警告
// eslint-disable-next-line no-unused-vars
// app.config.warnHandler = (msg, vm, trace) => {
//   //忽略ElPagination的警告
//   if (msg.includes("ElPagination")) {
//     return;
//   }
// };

//过滤resize的警告
// eslint-disable-next-line no-unused-vars
app.config.errorHandler = (err, vm, info) => {
  if (err.message.includes("ResizeObserver")) {
    return;
  }
};

app.use(pinia).use(router).use(ElementPlus).mount("#app");

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
