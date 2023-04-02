<template>
  <div class="header">
    <!-- 汉堡包图标 -->
    <el-icon @click="toggleAside" class="toggleIcon" size="22"><Operation /></el-icon>
    <!-- 路径 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item, index) in pageStore.getCurrentPath" :to="{ path: item.path }" :key="index">{{
        item.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
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
          <el-dropdown-item command="person">个人中心</el-dropdown-item>
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="about">关于</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
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
const authStore = useAuthStore();
const router = useRouter();
// 汉堡包
const pageStore = usePageStore();
const toggleAside = () => {
  pageStore.isAsideVisible = !pageStore.isAsideVisible;
};
const handleCommand = (command) => {
  switch (command) {
    case "person":
      router.push({ name: "home" });
      break;
    case "home":
      router.push({ path: "/home" });
      break;
    case "about":
      router.push({ name: "about" });
      break;
    case "logout":
      authStore.logout();
      router.replace({ name: "login" });
      break;
    default:
      break;
  }
};
</script>
<style scoped lang="scss">
.header {
  grid-area: header;
  background: #409eff;
  margin: 5px;
  border-radius: 1em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .toggleIcon {
    cursor: pointer;
    outline: none;
    &:hover {
      color: blue;
    }
  }
}
</style>
