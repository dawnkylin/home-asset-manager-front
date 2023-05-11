const Index = () => import("@views/index");

export default [
  // 首页
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: Index,
    children: [
      // 首页
      {
        path: "home",
        name: "home",
        component: () => import("@views/home"),
        meta: { requiresAuth: true, title: "首页", role: "user" },
      },
      // 关于
      {
        path: "about",
        name: "about",
        component: () => import("@views/about"),
        meta: { requiresAuth: true, title: "关于", role: "admin" },
      },
      // 个人中心
      {
        path: "profile",
        name: "profile",
        component: () => import("@views/profile"),
        meta: { requiresAuth: true, title: "个人中心", role: "user" },
      },
    ],
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("@views/login"),
    meta: { guestOnly: true, title: "登录", role: "user" },
  },
  // 注册
  {
    path: "/register",
    name: "register",
    component: () => import("@views/register"),
    meta: { guestOnly: true, title: "注册", role: "user" },
  },
  // 忘记密码
  {
    path: "/forgetPwd",
    name: "forgetPwd",
    component: () => import("@views/forgetPwd"),
    meta: { guestOnly: true, title: "忘记密码", role: "user" },
  },
  // 资产
  {
    path: "/asset",
    name: "asset",
    component: Index,
    redirect: "/asset/fixedasset",
    meta: { requiresAuth: true, title: "资产", type: "fixed", role: "user" },
    children: [
      {
        path: "fixedasset",
        name: "fixedAsset",
        component: () => import("@views/asset"),
        meta: { requiresAuth: true, title: "固定资产", type: "fixed", role: "user" },
      },
      {
        path: "fluidasset",
        name: "fluidAsset",
        component: () => import("@views/asset"),
        meta: { requiresAuth: true, title: "流动资产", type: "fluid", role: "user" },
      },
    ],
  },
  {
    path: "/finance",
    name: "finance",
    component: Index,
    redirect: "/income",
    meta: { requiresAuth: true, title: "财务记录", type: "income", role: "user" },
    children: [
      {
        path: "income",
        name: "income",
        component: () => import("@views/finance"),
        meta: { requiresAuth: true, title: "收入", type: "income", role: "user" },
      },
      {
        path: "expenditure",
        name: "expenditure",
        component: () => import("@views/finance"),
        meta: { requiresAuth: true, title: "支出", type: "expenditure", role: "user" },
      },
    ],
  },
  {
    path: "/assettype",
    name: "assettype",
    component: () => import("@views/assettype"),
    meta: { requiresAuth: true, title: "资产类型", role: "admin" },
  },
  // 无权访问页面
  {
    path: "/403",
    name: "forbidden",
    component: () => import("@views/ErrorPages/403"),
    meta: { title: "403" },
  },
  // 404
  {
    path: "/404",
    name: "notFound",
    component: () => import("@views/ErrorPages/404"),
    meta: { title: "404" },
  },
];
