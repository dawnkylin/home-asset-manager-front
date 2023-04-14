<!-- eslint-disable max-len -->
<template>
  <div class="container">
    <el-tooltip content="系统公告">
      <div class="affix" @click="drawer = true">
        <svg t="1680669098555" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2580" width="32" height="32">
          <path
            d="M558.9 914.5c-12.8 0-25.6-2.2-37.9-6.8-5.4-2-10.7-4.6-15.5-7.7l-219-140.4h-79.2c-78.9 0-143.1-64.2-143.1-143.1v-209c0-78.9 64.2-143.1 143.1-143.1h79.2l219-140.4c4.9-3.1 10.1-5.7 15.5-7.7 33.7-12.4 71.5-7.5 100.9 13 29.5 20.6 47.1 54.3 47.1 90.2v585c0 35.9-17.6 69.7-47.1 90.2-18.8 13.1-40.8 19.8-63 19.8z m-335-314.6h85.9c15.3 0 30.2 4.4 43.1 12.6l156.3 100.2V311.3L352.9 411.5c-12.9 8.2-27.8 12.6-43.1 12.6h-85.9v175.8zM880 591.9h-95.8c-44.1 0-79.9-35.8-79.9-79.9s35.8-79.9 79.9-79.9H880c44.1 0 79.9 35.8 79.9 79.9s-35.8 79.9-79.9 79.9zM851.9 854.9c-20.4 0-40.9-7.8-56.5-23.4l-67.8-67.8c-31.2-31.2-31.2-81.8 0-113s81.8-31.2 113 0l67.8 67.8c31.2 31.2 31.2 81.8 0 113-15.6 15.6-36 23.4-56.5 23.4zM784.2 396.6c-20.4 0-40.9-7.8-56.5-23.4-31.2-31.2-31.2-81.8 0-113l67.8-67.8c31.2-31.2 81.8-31.2 113 0s31.2 81.8 0 113l-67.8 67.8c-15.7 15.6-36.1 23.4-56.5 23.4z"
            fill="#666666" p-id="2581"></path>
        </svg>
      </div>
    </el-tooltip>

    <!-- el-drawer添加opened事件 -->
    <el-drawer v-model="drawer" title="系统公告" :size="drawerSize" @opened="drawerOpened">
      <template #default>
        <el-table :data="noticeData">
          <el-table-column prop="title" type="expand" show-overflow-tooltip min-width="30px">
            <template #default="{ row }">
              <el-row>
                <el-col :span="24">
                  <span>{{ row.content }}</span>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column prop="createdDate" label="发布时间" sortable show-overflow-tooltip min-width="150px">
          </el-table-column>
        </el-table>
      </template>
    </el-drawer>
    <!-- 侧边栏 -->
    <aside>
      <my-aside></my-aside>
    </aside>
    <!-- 主体 -->
    <el-scrollbar class="main" view-style="height:100%">
      <!-- 头部 -->
      <header>
        <my-header></my-header>
      </header>
      <!-- 内容 -->
      <section>
        <router-view v-slot="{Component}">
          <transition name="fade" mode="out-in">
            <div>
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </section>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
};
</script>

<script setup>
import myHeader from "@components/header";
import myAside from "@components/aside";
import { ref, computed } from "vue";
import axios from "@utils/request"

const drawer = ref(false);

const noticeData = ref([]);

const drawerSize = computed(() => {
  // 网页宽度大于540px时，设置drawerRef的宽度为100%
  if (document.body.clientWidth <= 540) {
    return "100%";
  }
  return "30%";
});

const drawerOpened = () => {
  // 获取系统公告数据
  axios.getRequest("/notice/getNotices").then((res) => {
    noticeData.value = res.data;
  });
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;

  /* 左侧固定aside */
  aside {
    height: 100%;
    width: fit-content;
    background: rgb(48, 65, 86);
    color: rgb(191, 203, 217);
  }

  /* 右侧main */
  .main {
    background-image: url("@assets/images/about_bg.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    // 滚动位置不变
    background-attachment: fixed;
    height: 100%;
    flex: 1;

    /* main的header */
    header {
      height: 50px;
      margin-bottom: 1em;
      box-shadow: 0px 2px 10px rgba(#000, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background-color: #f0f2f5;
    }

    /* main的section */
    section {
      height: calc(100% - 50px);
    }
  }

  .affix {
    position: absolute;
    right: 0;
    top: 70%;
    cursor: pointer;
    z-index: 2;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
