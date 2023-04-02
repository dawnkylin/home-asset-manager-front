<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
  <div>
    <el-button mb-2 @click="toggle">Switch Language</el-button>
    <br />
    <el-config-provider :locale="locale">
      <el-text class="mx-1">Default</el-text>
      <el-table mb-1 :data="[]" />
      <el-pagination :total="100" />
    </el-config-provider>
  </div>
  <el-rate v-model="value" :texts="['oops', 'disappointed', 'normal', 'good', 'great']" show-text />
</template>
<script>
export default {
  name: "AboutPage",
};
</script>
<script setup>
import { computed, ref } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import en from "element-plus/dist/locale/en.mjs";

const language = ref("zh-cn");
const locale = computed(() => (language.value === "zh-cn" ? zhCn : en));
const value = ref();

const toggle = () => {
  language.value = language.value === "zh-cn" ? "en" : "zh-cn";
};
</script>
