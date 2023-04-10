<!-- eslint-disable max-len -->
<template>
  <div id="container">
    <el-row>
      <el-col :span="24">
        <div style="text-align: center">
          <el-tooltip effect="dark" content="查看详情">
            <div class="title" @click="router.push({ name: 'about' })">家庭资产管家</div>
          </el-tooltip>
          <!-- 简介 -->
          <p style="color: gray;font-size: .8rem;">一款基于Vue3 + Element Plus + Echarts + Spring Boot的家庭资产管理系统</p>
        </div>
      </el-col>
    </el-row>
    <!-- 点击切换ECharts主题 -->
    <el-divider content-position="center">主题切换 -- {{ curTheme }}</el-divider>
    <el-tooltip effect="dark" content="点击切换图表主题" placement="top" v-for="tab in themeTabList" :key="tab.index">
      <div class="tab" v-html="tab.content" @click="themeTabClick"></div>
    </el-tooltip>
    <el-divider content-position="center">资产分析</el-divider>
    <el-row>
      <el-col :span="12" :xs="24">
        <!-- 不同类型的固定资产饼图 -->
        <div ref="chart2" style="height: 300px"></div>
      </el-col>
      <el-col :span="12" :xs="24">
        <!-- 不同类型的流动资产饼图 -->
        <div ref="chart3" style="height: 300px"></div>
      </el-col>
    </el-row>
    <el-divider content-position="center">收支分析</el-divider>
    <!-- 选择不同年份 -->
    <el-tooltip effect="dark" content="点击切换年份" placement="top" v-for="tab in yearTabList" :key="tab.index">
      <div class="tab" v-html="tab.content" @click="yearTabClick"></div>
    </el-tooltip>
    <el-row>
      <!-- 收支图：不同月份的月收入和月支出 -->
      <el-col :span="24" :xs="24">
        <div ref="chart1" style="height: 500px"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "HomePage"
};
</script>
<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import { getLocalStorage } from "@utils/storage";
import axios from "@utils/request";
// eslint-disable-next-line no-unused-vars
const vintageImport = () => import("@assets/echarts_theme/vintage");
// eslint-disable-next-line no-unused-vars
const darkImport = () => import("@assets/echarts_theme/dark");
// eslint-disable-next-line no-unused-vars
const chalkImport = () => import("@assets/echarts_theme/chalk");
// eslint-disable-next-line no-unused-vars
const macaronsImport = () => import("@assets/echarts_theme/macarons");
// eslint-disable-next-line no-unused-vars
const infographicImport = () => import("@assets/echarts_theme/infographic");
// eslint-disable-next-line no-unused-vars
const romaImport = () => import("@assets/echarts_theme/roma");
// eslint-disable-next-line no-unused-vars
const shineImport = () => import("@assets/echarts_theme/shine");
// eslint-disable-next-line no-unused-vars
const waldenImport = () => import("@assets/echarts_theme/walden");
// eslint-disable-next-line no-unused-vars
const westerosImport = () => import("@assets/echarts_theme/westeros");
// eslint-disable-next-line no-unused-vars
const wonderlandImport = () => import("@assets/echarts_theme/wonderland");
// eslint-disable-next-line no-unused-vars
const essosImport = () => import("@assets/echarts_theme/essos");
// eslint-disable-next-line no-unused-vars
const purplePassionImport = () => import("@assets/echarts_theme/purple-passion");

const router = useRouter();

// tabList包含当前年在内的最近三年的年份
const yearTabList = ref([
  { index: 0, content: new Date().getFullYear(), disable: true },
  { index: 1, content: new Date().getFullYear() - 1 },
  { index: 2, content: new Date().getFullYear() - 2 },
]);

const curYear = ref(new Date().getFullYear());
const yearTabClick = (e) => {
  // 点击的是当前年份
  if (e.target.innerHTML == curYear.value) {
    return;
  }
  // 点击的是其他年份
  curYear.value = e.target.innerHTML;
  // 等请求数据getIncomeData、getExpenseData完成再渲染图表
  Promise.all([getIncomeData(), getExpenseData()]).then(() => {
    renderChart1();
  });
};

const themeTabList = ref([
  { index: 0, content: "light" },
  { index: 1, content: "dark" },
  { index: 2, content: "vintage" },
  { index: 3, content: "chalk" },
  { index: 4, content: "macarons" },
  { index: 5, content: "infographic" },
  { index: 6, content: "roma" },
  { index: 7, content: "shine" },
  { index: 8, content: "walden" },
  { index: 9, content: "westeros" },
  { index: 10, content: "wonderland" },
  { index: 11, content: "essos" },
  { index: 12, content: "purplePassion" },
]);

// 主题切换
const themeTabClick = async (e) => {
  // 点击的是当前主题
  if (e.target.innerHTML == curTheme.value) {
    return;
  }
  // light是默认主题，不需要导入
  if (e.target.innerHTML !== "light") {
    await eval(e.target.innerHTML + "Import()");
  }
  // 点击的是其他主题
  // 销毁图表实例
  myChart1.value.dispose();
  myChart2.value.dispose();
  myChart3.value.dispose();
  curTheme.value = e.target.innerHTML;
  // 重新渲染图表
  renderChart1();
  renderChart2();
  renderChart3();
};

const curTheme = ref('light');

const chart1 = ref();
const chart2 = ref();
const chart3 = ref();

const myChart1 = computed(() => {
  return echarts.init(chart1.value, curTheme.value);
});
const myChart2 = computed(() => {
  return echarts.init(chart2.value, curTheme.value);
});
const myChart3 = computed(() => {
  return echarts.init(chart3.value, curTheme.value);
});

const incomeData = ref([]);

const expenseData = ref([]);

const getIncomeData = async () => {
  const res = await axios.getRequest("/finance/getIncomeByYear/" + getLocalStorage("user").id + "/" + curYear.value);
  incomeData.value = res.data;
};

const getExpenseData = async () => {
  const res = await axios.getRequest("/finance/getExpenseByYear/" + getLocalStorage("user").id + "/" + curYear.value);
  expenseData.value = res.data;
};

// 使用折线图，并标识最大值，最小值，平均值
const renderChart1 = () => {
  const option = {
    // 标题
    title: {
      text: curYear.value + "年收支图",
      // 标题位置
      left: "center",
      padding: 10,
    },
    // 提示框
    tooltip: {
      // 触发类型：坐标轴触发
      trigger: "axis",
    },
    // 图例
    legend: {
      data: ["月收入", "月支出"],
      // 图例位置
      left: "left",
      // 图例布局：垂直布局
      orient: "vertical",
    },
    // 工具栏
    toolbox: {
      // 显示工具栏
      show: true,
      // 工具栏配置
      feature: {
        // 数据视图
        dataView: {
          // 是否显示
          show: true,
          // 读写模式
          readOnly: false,
        },
        // 动态类型切换
        magicType: {
          // 是否显示
          show: true,
          // 动态类型
          type: ["line", "bar"],
        },
        // 保存为图片
        saveAsImage: {
          // 是否显示
          show: true,
        },
        // 还原
        restore: {
          // 是否显示
          show: true,
        },
      },
    },
    // x轴
    xAxis: {
      // 类型：类目轴
      type: "category",
      // 是否留白
      boundaryGap: false,
      // x轴数据
      data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    // y轴
    yAxis: {
      // 类型：数值轴
      type: "value",
      // y轴刻度
      axisLabel: {
        // 刻度格式化
        formatter: "{value} 元",
      },
    },
    // 数据
    series: [
      {
        // 系列名称，用于tooltip的显示，legend的图例筛选
        name: "月收入",
        // 图表类型：折线图
        type: "line",
        data: incomeData.value,
        // 标记点
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" },
          ],
        },
        // 标记线
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
        // 折线图平滑
        smooth: true,
        // 面积图
        areaStyle: {},
      },
      {
        name: "月支出",
        type: "line",
        data: expenseData.value,
        // 标记点
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            { type: "min", name: "最小值" },
          ],
        },
        // 标记线
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
        // 折线图平滑
        smooth: true,
        // 面积图
        areaStyle: {},
      },
    ],
  };
  myChart1.value.setOption(option, true);
};
const renderChart2 = () => {
  const option = {
    title: {
      text: "固定资产",
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["房产", "车辆","", "其他"],
    },
    series: [
      {
        name: "固定资产",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [
          { value: 335, name: "房产" },
          { value: 310, name: "车辆" },
          { value: 234, name: "其他" },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart2.value.setOption(option, true);
};
const renderChart3 = () => {
  const option = {
    title: {
      text: "流动资产",
      left: "center",
      top: 20,
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      data: ["现金", "银行卡", "其他"],
    },
    series: [
      {
        name: "流动资产",
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: [
          { value: 335, name: "现金" },
          { value: 310, name: "银行卡" },
          { value: 234, name: "其他" },
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  myChart3.value.setOption(option, true);
};


onMounted(() => {
  // 等请求数据getIncomeData、getExpenseData完成再渲染图表
  Promise.all([getIncomeData(), getExpenseData()]).then(() => {
    renderChart1();
    renderChart2();
    renderChart3();
  });

  // 监听容器尺寸变化，重绘图表
  const resizeObserver = new ResizeObserver(() => {
    myChart1.value.resize();
    myChart2.value.resize();
    myChart3.value.resize();
  });
  resizeObserver.observe(chart1.value);
  resizeObserver.observe(chart2.value);
  resizeObserver.observe(chart3.value);
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Long+Cang&display=swap");

#container {
  height: 100%;

  .el-row {
    margin: 0 .5rem .5rem;

    .el-col {
      padding: .3rem;

      &>* {
        padding: .5rem;
        border-radius: 0.3rem;
        box-shadow: rgba(10, 37, 64, 0.35) 0px -2px 6px 5px inset;
        // background-color: v-bind('chartBgColor');
      }
    }
  }

  .title {
    font-family: "Long Cang", cursive;
    cursor: pointer;
    font-weight: bold;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 10px #dc1423;
    display: inline-block;
    margin: 0 auto;
    animation: animate 3s 0.5s linear infinite;

    @keyframes animate {
      from {
        // filter: hue-rotate(0deg);是css3的滤镜属性，可以改变元素的颜色，hue-rotate(0deg)表示不改变颜色
        filter: hue-rotate(0deg);
      }

      to {
        filter: hue-rotate(360deg);
      }
    }
  }

  .tab {
    display: inline-block;
    margin: .2rem .5rem;
    padding: .2rem .5rem;
    border-radius: .5rem;
    background-color: rgba(231, 235, 241, 0.7);
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background-color: rgba(153, 181, 222, 0.9);
    }
  }
}

.notice {
  color: #409eff;
  font-size: 1.3em;
  margin-left: 10px;
}
</style>
