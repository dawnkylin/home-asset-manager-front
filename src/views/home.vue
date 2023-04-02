<template>
  <el-scrollbar id="container">
    <el-row>
      <el-col :span="24">
        <!-- 系统公告 -->
        <div style="text-align: center">
          <h3>家庭资产管家</h3>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template #title>
                <span class="notice">系统公告</span>
              </template>
              <el-table :data="noticeTable">
                <el-table-column label="公告标题" prop="title"></el-table-column>
                <el-table-column label="公告内容" prop="content"></el-table-column>
                <el-table-column label="发布时间" prop="date"></el-table-column>
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <!-- 收支图 -->
      <el-col :span="14" style="height: 300px">
        <div ref="chart"></div>
      </el-col>
      <el-col :span="10">
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

const noticeTable = ref();

const activeNames = ref(["1"]);

const myChart = computed(() => {
  return echarts.init(chart.value);
});

const renderChart = () => {
  const option = {
    title: {
      text: "支出和收入对比",
    },
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

  window.addEventListener("resize", () => {
    myChart.value.resize();
  });
});
</script>
<style scoped lang="scss">
#container {
  .el-row {
    margin-bottom: 2em;
    &:last-child {
      margin-bottom: 0;
    }
    .el-col {
      padding: 0px 10px;
      & > div {
        height: 100%;
        padding: 0.5em;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
          rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
        border-radius: 0.3em;
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
