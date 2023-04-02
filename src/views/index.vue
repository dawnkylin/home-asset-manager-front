<template>
  <div class="index">
    <div class="affix" @click="drawer = true">
      <el-icon size="30" color="blue"><Tools /></el-icon>
    </div>
    <el-drawer v-model="drawer" title="系统信息">
      <template #default>
        123
      </template>
    </el-drawer>
    <my-header v-area="pageStore.isAsideVisible"></my-header>
    <my-aside v-show="pageStore.isAsideVisible"></my-aside>
    <main v-area="pageStore.isAsideVisible">
      <router-view></router-view>
    </main>
    <my-footer></my-footer>
  </div>
</template>
<script>
export default {
  name: "IndexPage",
};
</script>
<script setup>
import myHeader from "@components/header";
import myFooter from "@components/footer";
import myAside from "@components/aside";
import vArea from "@directives/vArea";
import {ref } from "vue";

const drawer = ref(false);

</script>

<style scoped lang="scss">
.index {
  height: 105%;
  display: grid;
  grid-template-areas:
    "aside header"
    "aside main"
    "footer footer";
  grid-template-columns: 20% 80%;
  grid-template-rows: 10% 85% 5%;
  main {
    grid-area: main;
    padding: 5px;
  }
  .affix {
    position: absolute;
    right: 0;
    top: 70%;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
