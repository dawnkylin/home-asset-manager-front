import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/ham/background",
  timeout: 10000,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // 设置请求头，token，后端会根据token判断是否登录，是否有权限，是否过期，是否需要刷新token，是否需要重新登录，是否需要重新授权
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 拦截响应，检查token是否过期，过期则跳转到登录页面，重新登录，获取新的token，重新请求，否则直接返回数据，不做任何处理
instance.interceptors.response.use((response) => {
  // token过期，重新登录，获取新的token，重新请求，否则直接返回数据，不做任何处理
  if (response.code === "40401") {
    localStorage.removeItem("token");
    router.replace({
      path: "/login",
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
