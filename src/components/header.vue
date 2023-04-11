<template>
  <!-- 汉堡包图标 -->
  <el-icon @click="toggleAside" class="toggleIcon" size="22"><Operation /></el-icon>
  <!-- 路径 -->
  <el-breadcrumb separator="/">
    <!-- 默认首页在前面 -->
    <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in pageStore.getCurrentPath" :to="{ name: item.name }" :key="index">{{
      item.title
    }}</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 头像 -->
  <el-dropdown trigger="click" @command="handleCommand">
    <span style="outline: none">
      <!-- 头像 -->
      <el-avatar
        :size="39"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        style="cursor: pointer"
      />
      <el-icon>
        <arrow-down style="cursor: pointer" />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">个人中心</el-dropdown-item>
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="about">关于</el-dropdown-item>
        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
export default {
  name: "HeaderPage",
};
</script>
<script setup>
import { usePageStore } from "@stores/public";
import { useRouter } from "vue-router";
import { useAuthStore } from "@stores/auth";
import axios from "@utils/request";

const authStore = useAuthStore();
const router = useRouter();
const pageStore = usePageStore();
// 点击汉堡包图标，展开或收起侧边栏
const toggleAside = () => {
  pageStore.isCollapse = !pageStore.isCollapse;
};
// 点击头像，展开或收起下拉菜单，点击下拉菜单的选项，跳转到相应页面
const handleCommand = (command) => {
  switch (command) {
    case "profile":
      router.push({ name: "profile" });
      break;
    case "home":
      router.push({ path: "/home" });
      break;
    case "about":
      router.push({ name: "about" });
      break;
    case "logout":
      // 退出登录
      axios
        .postRequest("/auth/logout")
        .then((res) => {
          console.log(res.message);
          authStore.logout();
        })
        .finally(() => {
          router.push({ name: "login" });
        });
      break;
    default:
      break;
  }
};
</script>
<style scoped lang="scss">
.toggleIcon {
  cursor: pointer;
  outline: none;
  &:hover {
    color: blue;
  }
}
</style>
