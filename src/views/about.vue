<template>
  <div class="container">
    <el-row>
      <el-col>
        <h1 class="title">家庭资产管家</h1>
      </el-col>
    </el-row>
    <el-divider style="border-width: 1px;border-color: violet;" content-position="left">项目Github地址</el-divider>
    <!-- 前端项目和后端项目的github地址 -->
    <el-row :gutter="20">
      <el-col :span="12" style="text-align: right;">
        <el-link type="primary" class="githubLink" :underline="false"
          href="https://github.com/Shadow-Kylin/home-asset-manager-front">前端项目</el-link>
      </el-col>
      <el-col :span=12 style="text-align: left;">
        <el-link type="primary" class="githubLink" :underline="false"
          href="https://github.com/Shadow-Kylin/home-asset-manager">后端项目</el-link>
      </el-col>
    </el-row>
    <!-- 项目时间线 -->
    <el-divider style="border-width: 1px;border-color: violet;" content-position="left">项目开发时间线</el-divider>
    <el-row>
      <el-col :span="5"></el-col>
      <el-col :span="3">
        <el-timeline>
          <el-timeline-item v-for="(log, index) in logs" :key="index" :icon="log.icon" :color="log.color"
            :timestamp="log.timestamp" style="cursor: pointer;font-size: 1rem;" @click="showDetail(log)">
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="3"></el-col>
      <el-col :span="10">
        <el-card>
          <h4>{{ logDetail.title }}</h4>
          <div v-html="logDetail.content"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "AboutPage",
};
</script>
<script setup>
import { ref, } from "vue";
import { Location } from "@element-plus/icons-vue";

const logDetail = ref({
  content: "<div>点击左侧时间线查看开发发日志</div>"
});

const logs = ref([
  {
    index: 1,
    icon: Location,
    color: '#0bbd87',
    timestamp: '2023-01-01',
    title: '项目开始',
    content:
      "<p>确定项目功能：用户登录、用户注册、用户信息管理、资产管理、资产类型管理、财务管理、数据统计</p>" +
      "<p>确定项目架构：前后端分离，前端使用Vue3+Element plus+Vue Router+Pinia+Webpack，后端使用Spring Boot+MyBatis+MySQL</p>" +
      "<p>确定项目开发工具：前端使用VS Code，后端使用IDEA</p>" +
      "<p>确定项目开发环境：前端使用Node.js 14.15.4，后端使用JDK 1.8</p>" +
      "<p>确定项目开发规范：前端使用ESLint+Prettier</p>" +
      "<p>确定项目版本管理：使用Git+Github</p>",
  },
  {
    index: 2,
    icon: Location,
    color: '#0bbd87',
    timestamp: '2023-02-01',
    title: '数据库设计',
    content: "<p>确定数据库表结构：有用户表、资产表、资产类型表和财务表</p>" +
      "<p>确定数据库表之间的关系：资产类型表只能由管理员修改</p>",
  },
  {
    index: 3,
    icon: Location,
    color: '#0bbd87',
    timestamp: '2023-03-01',
    title: '后端接口开发',
    content: "<p>确定后端接口：用户登录、用户注册(包含阿里云短信接口)、用户信息管理、资产管理、资产类型管理、财务管理、数据统计</p>" +
      "<p>确定后端接口的请求方式：GET、POST</p>" +
      "<p>确定后端接口的请求路径：/api/v1/xxx</p>" +
      "<p>确定后端接口的请求参数：请求参数的名称、请求参数的类型、请求参数的是否必填</p>" +
      "<p>确定后端接口的返回值：返回值的状态码、返回值的状态信息、返回值的数据</p>",
  },
  {
    index: 4,
    icon: Location,
    color: '#0bbd87',
    timestamp: '2023-04-01',
    title: '前端页面开发',
    content: "<p>用户页面：登录页、注册页、详情页、主页、资产管理页(固定资产和流动资产)、财务管理页(收入和支出)、个人中心</p>" +
      "<p>管理员页面：登录页、注册页、详情页、主页、资产管理页(固定资产和流动资产)、财务管理页(收入和支出)、个人中心、资产类型管理页</p>",
  }
]);

const showDetail = (log) => {
  logDetail.value = log;
}
</script>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Zhi+Mang+Xing&display=swap');



.container {
  min-height: 100%;
  background-image: url("@assets/images/about_bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  // 滚动位置不变
  background-attachment: fixed;
  margin-top: -1rem;

  .title {
    font-family: 'Zhi Mang Xing', cursive;
    font-size: 3rem;
    text-align: center;
    color: #211212;
    text-shadow: 5px 5px 10px rgb(76, 74, 74);
  }

  .githubLink {
    background-color: #7e8ad7;
    color: #6b1c1c;
    border-radius: .8rem;
    font-size: 1.2rem;
    padding: 0.5rem 1rem;

    &:hover {
      background-color: #e6a23c;
      color: #fff;
    }
  }
}

.el-row {
  margin-right: 0 !important;
  padding: 0 1rem;
}
</style>
