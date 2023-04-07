<template>
  <el-scrollbar id="container">
    <el-row>
      <el-col :span="24">
        <!-- 系统公告 -->
        <div style="text-align: center">
          <h3>家庭资产管家</h3>
          <!-- 简介 -->
          <p style="color: gray;font-size: .8rem;">一款基于Vue3 + Element Plus + Echarts + Spring Boot的家庭资产管理系统</p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <!-- 收支图 -->
      <el-col :span="14" :xs="24" style="height: 300px">
        <div ref="chart"></div>
      </el-col>
      <el-col :span="10" :xs="24">
        <div>
          <el-row>
            <el-col :span="12">
              <el-statistic title="总收入"></el-statistic>
            </el-col>
            <el-col :span="12">
              <el-statistic title="总支出"></el-statistic>
            </el-col>
          </el-row>
          <el-row>
            <!-- 选择显示日期区间 -->
            <el-col>
              <el-date-picker
                v-model="date"
                type="daterange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-statistic title="总资产"></el-statistic>
            </el-col>
            <el-col :span="12">
              <el-statistic title="总负债"></el-statistic>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </el-scrollbar>
</template>
<script>
export default {
  name: "HomePage",
};
</script>
<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import * as echarts from "echarts";

const date = ref();

const chart = ref();

const myChart = computed(() => {
  return echarts.init(chart.value);
});

const renderChart = () => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["支出", "收入"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "金额（元）",
        min: 0,
        max: 5000,
        interval: 1000,
        axisLabel: {
          formatter: "{value} ",
        },
      },
    ],
    series: [
      {
        name: "支出",
        type: "bar",
        data: [1000, 2000, 1500, 3000, 2500, 1800, 2000, 1800, 2500, 3000, 3500, 2800],
      },
      {
        name: "收入",
        type: "bar",
        data: [2000, 2500, 1800, 3500, 3000, 2200, 2800, 2600, 3200, 3800, 0, 4000],
      },
    ],
  };
  myChart.value.setOption(option, true);
};

const containerNode = ref();

onMounted(() => {
  // 阻止滚动冒泡
  containerNode.value = document.querySelector("#container");
  containerNode.value.addEventListener("wheel", function (event) {
    event.stopPropagation();
  });
  renderChart();

  // 监听容器尺寸变化，重绘图表
  const resizeObserver = new ResizeObserver(() => {
      myChart.value.resize();
  });
  resizeObserver.observe(chart.value);
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});
</script>
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Long+Cang&display=swap");
#container {
  .el-row {
    margin-bottom: 1em;
    &:last-child {
      margin-bottom: 0;
    }
    .el-col {
      padding: 0px 10px;
      margin-bottom: 1em;
      & > div {
        height: 100%;
        padding: 0.5em;
        box-shadow: rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
        border-radius: 0.3em;
      }
    }
  }

  h3 {
    font-family: "Long Cang", cursive;
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 10px #dc1423;
    text-align: center;
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
}

.notice {
  color: #409eff;
  font-size: 1.3em;
  margin-left: 10px;
}
</style>
