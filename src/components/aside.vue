<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="transparent"
    default-active="1"
    text-color="#fff"
    @select="handleSelect"
    style="border: none"
    :collapse="pageStore.isCollapse"
  >
    <el-menu-item index="1">
      <el-icon><House /></el-icon>
      <span>首页</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Coin /></el-icon>
        <span>家庭资产</span>
      </template>
      <el-menu-item index="2-1">
        <el-icon><CreditCard /></el-icon>
        <span>固定资产</span>
      </el-menu-item>
      <el-menu-item index="2-2">
        <el-icon><Money /></el-icon>
        <span>流动资产</span>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><List /></el-icon>
        <span>财务记录</span>
      </template>
      <el-menu-item index="3-1">
        <el-icon><Wallet /></el-icon>
        <span>收入</span>
      </el-menu-item>
      <el-menu-item index="3-2">
        <el-icon><Coin /></el-icon>
        <span>支出</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
<script>
export default {
  name: "AsidePage",
};
</script>
<script setup>
import { useRouter } from "vue-router";
import { usePageStore } from "@stores/public";

const pageStore = usePageStore();

const router = useRouter();

const handleSelect = (key) => {
  switch (key) {
    case "1":
      router.push({ name: "home" });
      break;
    case "2-1":
      router.push({ name: "fixedAsset" });
      break;
    case "2-2":
      router.push({ name: "fluidAsset" });
      break;
    case "3-1":
      router.push({ name: "income" });
      break;
    case "3-2":
      router.push({ name: "expenditure" });
      break;
    default:
      break;
  }
};
</script>
<style scoped lang="scss"></style>
