<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="rgb(48, 65, 86)"
    :default-active="defaultActive"
    text-color="#fff"
    @select="handleSelect"
    style="border: none"
    :collapse="pageStore.isCollapse"
  >
    <el-menu-item index="home">
      <el-icon><House /></el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-sub-menu index="asset">
      <template #title>
        <el-icon><Coin /></el-icon>
        <span>家庭资产</span>
      </template>
        <el-menu-item index="fixedAsset">
          <el-icon><CreditCard /></el-icon>
          <span>固定资产</span>
        </el-menu-item>
        <el-menu-item index="fluidAsset">
          <el-icon><Money /></el-icon>
          <span>流动资产</span>
        </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="finance">
      <template #title>
        <el-icon><List /></el-icon>
        <span>财务记录</span>
      </template>
      <el-menu-item index="income">
        <el-icon><Wallet /></el-icon>
        <span>收入</span>
      </el-menu-item>
      <el-menu-item index="expenditure">
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
import { useRouter,useRoute } from "vue-router";
import { usePageStore } from "@stores/public";
import { computed } from "vue";

const pageStore = usePageStore();

const router = useRouter();

const route = useRoute();

const defaultActive = computed(() => {
  switch (route.name) {
    case "home":
      return "home";
    case "fixedAsset":
      return "fixedAsset";
    case "fluidAsset":
      return "fluidAsset";
    case "income":
      return "income";
    case "expenditure":
      return "expenditure";
    default:
      return "home";
  }
});

const handleSelect = (key) => {
  switch (key) {
    case "home":
      router.push({ name: "home" });
      break;
    case "fixedAsset":
      router.push({ name: "fixedAsset" });
      break;
    case "fluidAsset":
      router.push({ name: "fluidAsset" });
      break;
    case "income":
      router.push({ name: "income" });
      break;
    case "expenditure":
      router.push({ name: "expenditure" });
      break;
    default:
      break;
  }
};
</script>
<style scoped lang="scss"></style>
