import {Index} from '@views/index'

export default [
  // 首页
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: () => import("@/src/views/index"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "/home",
        name: "home",
        component: () => Index,
        meta: { requiresAuth: true, title: "主页" },
      },
      {
        path: "/about",
        name: "about",
        component: () => import("@views/about"),
        meta: { requiresAuth: true, title: "关于" },
      },
    ],
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("@views/login"),
    meta: { guestOnly: true, title: "登录" },
  },
  // 管理
  {
    path: "/manage",
    component: Index,
    children: [
      {
        path: "/manage/asset",
        name: "asset",
        component: () => import("@views/asset"),
        meta: { requiresAuth: true, title: "资产" },
      },
      {
        path: "/manage/finance",
        name: "finance",
        component: () => import("@views/finance"),
        meta: { requiresAuth: true, title: "财务记录" },
      },
      {
        path: "/manage/assettype",
        name: "assettype",
        component: () => import("@views/assettype"),
        meta: { requiresAuth: true, title: "资产类型",roles:['admin'] },
      },
    ],
  },
  // 个人中心
  // 错误页面
];
