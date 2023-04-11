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
        meta: { requiresAuth: true, title: "首页" },
      },
      // 关于
      {
        path: "about",
        name: "about",
        component: () => import("@views/about"),
        meta: { requiresAuth: true, title: "关于" },
      },
      // 个人中心
      {
        path: "profile",
        name: "profile",
        component: () => import("@views/profile"),
        meta: { requiresAuth: true, title: "个人中心" },
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
  // 注册
  {
    path: "/register",
    name: "register",
    component: () => import("@views/register"),
    meta: { guestOnly: true, title: "注册" },
  },
  // 资产
  {
    path: "/asset",
    name: "asset",
    component: Index,
    redirect: "/asset/fixedasset",
    meta: { requiresAuth: true, title: "资产", type: "fixed" },
    children: [
      {
        path: "fixedasset",
        name: "fixedAsset",
        component: () => import("@views/asset"),
        meta: { requiresAuth: true, title: "固定资产", type: "fixed" },
      },
      {
        path: "fluidasset",
        name: "fluidAsset",
        component: () => import("@views/asset"),
        meta: { requiresAuth: true, title: "流动资产", type: "fluid" },
      },
    ],
  },
  {
    path: "/finance",
    name: "finance",
    component: Index,
    redirect: "/income",
    meta: { requiresAuth: true, title: "财务记录" },
    children: [
      {
        path: "income",
        name: "income",
        component: () => import("@views/finance"),
        meta: { requiresAuth: true, title: "收入", type: "income" },
      },
      {
        path: "expenditure",
        name: "expenditure",
        component: () => import("@views/finance"),
        meta: { requiresAuth: true, title: "支出", type: "expenditure" },
      },
    ],
  },
  {
    path: "/assettype",
    name: "assettype",
    component: () => import("@views/assettype"),
    meta: { requiresAuth: true, title: "资产类型", roles: ["admin"] },
  },
  // 错误页面
];
