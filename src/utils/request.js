import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// 创建axios实例
const instance = axios.create({
  baseURL: "/ham/background",
  timeout: 10000,
});

// 拦截请求，检查是否有token，有则设置请求头，没有则不设置请求头
instance.interceptors.request.use((config) => {
  // 从localStorage中获取token
  const token = localStorage.getItem("token");
  if (token) {
    // 设置请求头，后端会根据token判断是否登录
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 拦截响应
instance.interceptors.response.use((response) => {
  // 1002：未登录，没有token或token没有Bearer前缀
  // 1003：token过期，重新登录
  if (response.code === 1002|| response.code === 1003) {
    router.replace({
      path: "/login",
      // 将当前页面的路径作为参数，登录成功后跳转到该页面
      query: { redirect: router.currentRoute.fullPath },
    });
  }
  return response;
});

export default {
  getRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
      instance
        .get(url, params)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  postRequest(url, params = {}) {
    return new Promise((resolve, reject) => {
      instance
        .post(url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
