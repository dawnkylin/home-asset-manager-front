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
    <el-divider content-position="center">总览 -- {{ curTheme }}</el-divider>
    <!-- 家庭总资产、家庭成员人数、固定资产总数、流动资产总数 -->
    <el-row>
      <!-- 使用一个个tab不美观，使用下拉框 -->
      <el-col :span="24">
        <el-select v-model="curTheme" placeholder="切换图表主题" @change="themeChange">
          <el-option v-for="item in themeList" :key="item.index" :label="item.content" :value="item.content">
            <el-tag type="success">{{ item.content }}</el-tag>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>家庭资产总额</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ totalAssetValue }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <User />
            </el-icon>
            <span>家庭成员人数</span><br>
            <span style="color: rgb(214, 141, 46);">{{ familyMemberNum }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>固定资产总额</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ fixedAssetValue }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>流动资产总额</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ fluidAssetValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
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
    <el-row>
      <el-col>
        <!-- 选择不同年份 -->
        <el-tooltip effect="dark" content="点击切换年份" placement="top" v-for="tab in yearTabList" :key="tab.index">
          <div class="tab" v-html="tab.content" @click="yearTabClick"></div>
        </el-tooltip>
      </el-col>
      <!-- 年收支图：不同月份的月收入和月支出 -->
      <el-col :span="24" :xs="24">
        <div ref="chart1" style="height: 500px"></div>
      </el-col>
      <!-- 总收入、总支出、结余 -->
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>总收入</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ totalIncome }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>总支出</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ totalExpenditure }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24">
        <el-card shadow="hover" class="box-card">
          <div class="text item">
            <el-icon>
              <WalletFilled />
            </el-icon>
            <span>结余</span><br>
            <span style="color: rgb(214, 141, 46);">¥ {{ balance }}</span>
          </div>
        </el-card>
      </el-col>
      <!-- 使用时间选择器选择时间段 -->
      <el-col :span="24" :xs="24">
        <el-date-picker v-model="dateRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" align="right" @change="debounceDateChange" value-format="YYYY-MM-DD"></el-date-picker>
      </el-col>
      <!-- 指定时间段的收支图 -->
      <el-col :span="24" :xs="24">
        <div ref="chart4" style="height: 500px"></div>
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
import { onMounted, ref, onBeforeUnmount, computed } from "vue";
import * as echarts from "echarts";
import { useRouter } from "vue-router";
import { getLocalStorage, setLocalStorage } from "@utils/storage";
import axios from "@utils/request";
import debounce from "lodash/debounce";
import { useAuthStore } from "@stores/auth";
import { get } from "lodash";
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

const authStore = useAuthStore();

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

const themeList = ref([
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

const themeChange = async (value) => {
  // light是默认主题，不需要导入
  if (value !== "light") {
    await eval(value + "Import()");
  }
  // 重新渲染图表
  renderChart1();
  renderChart2();
  renderChart3();
  drawFinanceChart();
};

const curTheme = ref('dark');

const chart1 = ref();

const chart2 = ref();

const chart3 = ref();

const chart4 = ref();

const myChart1 = computed(() => {
  if (myChart1.value != null) {
    myChart1.value.dispose();
  }
  return echarts.init(chart1.value, curTheme.value);
}, [curTheme]);
const myChart2 = computed(() => {
  if (myChart2.value != null) {
    myChart2.value.dispose();
  }
  return echarts.init(chart2.value, curTheme.value);
}, [curTheme]);
const myChart3 = computed(() => {
  if (myChart3.value != null) {
    myChart3.value.dispose();
  }
  return echarts.init(chart3.value, curTheme.value);
}, [curTheme]);
const myChart4 = computed(() => {
  if (myChart4.value != null) {
    myChart4.value.dispose();
  }
  return echarts.init(chart4.value, curTheme.value);
}, [curTheme]);

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

const getFinancialDataByTimeRange = async () => {
  const res = await axios.getRequest("/finance/getFinancialDataByTimeRange" +
    "?userId=" + getLocalStorage("user").id +
    "&startDate=" + dateRange.value[0] +
    "&endDate=" + dateRange.value[1]);
  financeData.value = res.data;
};

const fixedData = ref([]);

const getFixedData = async () => {
  const res = await axios.getRequest("/asset/analyseFixedAsset" +
    "?userId=" + getLocalStorage("user").id +
    "&homeSerialNumber=" + getLocalStorage("user").homeSerialNumber);
  fixedData.value = res.data;
};

const fluidData = ref([]);

const getFluidData = async () => {
  const res = await axios.getRequest("/asset/analyseFluidAsset" +
    "?userId=" + getLocalStorage("user").id +
    "&homeSerialNumber=" + getLocalStorage("user").homeSerialNumber);
  fluidData.value = res.data;
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
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
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
    series: [
      {
        name: "固定资产",
        type: "pie",
        // 允许标签重叠
        avoidLabelOverlap: false,
        // 饼图的半径
        radius: '60%',
        center: ['50%', '60%'],
        data: fixedData.value,
        // 饼图的标签
        label: {
          show: true,
          position: 'outside'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
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
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
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
    series: [
      {
        name: "流动资产",
        type: "pie",
        radius: ['20%', '70%'],
        center: ['50%', '60%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
        },
        data: fluidData.value,
      },
    ],
  };
  myChart3.value.setOption(option, true);
};
const drawFinanceChart = () => {
  // 提取时间和金额数据
  const date = financeData.value.map(item => item.date);
  const income = financeData.value.map(item => item.income);
  const expenditure = financeData.value.map(item => -item.expenditure);

  // 调整时间间隔的显示
  // const xAxisData = adjustTimeIntervals(date);

  // 设置图表配置项
  const options = {
    title: {
      text: '财务统计图',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    legend: {
      data: ['收入', '支出'],
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        const dataIndex = params[0].dataIndex;
        const incomeValue = income[dataIndex];
        const expenditureValue = expenditure[dataIndex];
        return `日期：${date[dataIndex]}<br>收入：${incomeValue}元<br>支出：${-expenditureValue.toFixed(2)}元
        <br>结余：${(incomeValue + expenditureValue).toFixed(2)}元`;
      },
    },
    xAxis: {
      type: 'category',
      data: date,
      axisLabel: {
        rotate: 45, // 旋转x轴标签，避免重叠
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 12,
      },
    },
    dataZoom: [
      {
        type: 'inside', // 内置的数据缩放
        start: 0, // 默认起始位置
        end: 100, // 默认结束位置
        zoomOnMouseWheel: 'shift', // 按住Shift键进行鼠标滚轮缩放
      },
      {
        type: 'slider', // 数据缩放滑动条
        start: 0, // 默认起始位置
        end: 100, // 默认结束位置
      },
    ],
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: income,
        smooth: true, // 平滑曲线
        sampling: 'lttb',// 降采样，减少数据量，提高性能
        markLine: {
          data: [
            { type: 'average', name: '平均值' },
          ],
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' },
          ],
        },
        itemStyle: {
          color: '#1890FF',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(100, 241, 200)'
            },
            {
              offset: 1,
              color: 'rgb(10, 150, 200)'
            }
          ])
        },
      },
      {
        name: '支出',
        type: 'line',
        data: expenditure,
        smooth: true, // 平滑曲线
        sampling: 'lttb',// 降采样
        markLine: {
          data: [
            { type: 'average', name: '平均值' },
          ],
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' },
          ],
        },
        itemStyle: {
          color: '#FF4D4F',
        },
        areaStyle: {

          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 158, 68)'
            },
            {
              offset: 1,
              color: 'rgb(255, 70, 131)'
            }
          ])
        },
      },
    ],
  };
  // 绘制图表
  myChart4.value.setOption(options);
}

let resizeObserver = null;

//随机财务数据示例
const financeData = ref([]);

const adjustTimeIntervals = (time) => {
  const interval = Math.ceil(time.length / 8); // 设置时间间隔的显示，这里以每8个日期显示一个日期为例
  const xAxisData = [];
  for (let i = 0; i < time.length; i += interval) {
    xAxisData.push(time[i]);
  }
  return xAxisData;
}

//获取日期的YYYY-MM-DD格式
const getFormatDate = (date) => {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return year + "-" + month + "-" + day;
}
//获取距离今天一个月前的日期
const getOneMonthAgoDate = () => {
  let date = new Date();
  date.setMonth(date.getMonth() - 1);
  return getFormatDate(date);
}
const dateRange = ref([getOneMonthAgoDate(), getFormatDate(new Date())]);

const debounceDateChange = debounce(() => {
  // 等请求数据getIncomeData、getExpenseData完成再渲染图表
  Promise.all([getFinancialDataByTimeRange()]).then(() => {
    drawFinanceChart();
  });
}, 500);

const totalAssetValue = ref(0);
const fixedAssetValue = ref(0);
const fluidAssetValue = ref(0);
const familyMemberNum = ref(0);
const totalIncome = ref(0);
const totalExpenditure = ref(0);
const balance = ref(0);

//获取家庭成员数量
const getFamilyMemberNum = () => {
  let homeSerialNumber = getLocalStorage("user").homeSerialNumber;
  if (homeSerialNumber == null) {
    return;
  }
  axios.getRequest("/account/getFamilyMemberNum/" + homeSerialNumber).then((res) => {
    familyMemberNum.value = res.data;
  }).catch((err) => {
    console.log(err);
  });
}

onMounted(() => {
  authStore.websocket.onmessage = (e) => {
    setLocalStorage("user", e.data);
    const data = JSON.parse(e.data);
    authStore.user = data;
    // 等请求数据完成再渲染图表
    Promise.all([getIncomeData(), getExpenseData(), getFixedData(), getFluidData(), getFamilyMemberNum(), getFinancialDataByTimeRange()]).then(() => {
      //由expenseData和incomeData计算出totalAssetValue、fixedAssetValue、fluidAssetValue
      fixedAssetValue.value = fixedData.value.reduce((total, item) => total + item.value, 0);
      fluidAssetValue.value = fluidData.value.reduce((total, item) => total + item.value, 0);
      totalAssetValue.value = fixedAssetValue.value + fluidAssetValue.value;
      //由financeData计算出totalIncome、totalExpenditure、balance
      totalIncome.value = financeData.value.reduce((total, item) => total + item.income, 0);
      totalExpenditure.value = financeData.value.reduce((total, item) => total + item.expenditure, 0);
      balance.value = totalIncome.value - totalExpenditure.value;
      renderChart1();
      renderChart2();
      renderChart3();
      drawFinanceChart();
    }).then(() => {
      //监听chart1、chart2、chart3尺寸变化，重绘图表
      resizeObserver = new ResizeObserver(() => {
        //使用lodash的防抖函数，避免频繁使用echarts实例的resize方法
        debounce(() => {
          myChart1.value.resize();
          myChart2.value.resize();
          myChart3.value.resize();
        }, 500)();
      });
      resizeObserver.observe(chart1.value);
      resizeObserver.observe(chart2.value);
      resizeObserver.observe(chart3.value);

    });
  }
  // 等请求数据完成再渲染图表
  Promise.all([getIncomeData(), getExpenseData(), getFixedData(), getFluidData(), getFamilyMemberNum(), getFinancialDataByTimeRange()]).then(() => {
    //由expenseData和incomeData计算出totalAssetValue、fixedAssetValue、fluidAssetValue
    fixedAssetValue.value = fixedData.value.reduce((total, item) => total + item.value, 0);
    fluidAssetValue.value = fluidData.value.reduce((total, item) => total + item.value, 0);
    totalAssetValue.value = fixedAssetValue.value + fluidAssetValue.value;
    //由financeData计算出totalIncome、totalExpenditure、balance
    totalIncome.value = financeData.value.reduce((total, item) => total + item.income, 0);
    totalExpenditure.value = financeData.value.reduce((total, item) => total + item.expenditure, 0);
    balance.value = totalIncome.value - totalExpenditure.value;
    renderChart1();
    renderChart2();
    renderChart3();
    drawFinanceChart();
  }).then(() => {
    //监听chart1、chart2、chart3尺寸变化，重绘图表
    resizeObserver = new ResizeObserver(() => {
      //使用lodash的防抖函数，避免频繁使用echarts实例的resize方法
      debounce(() => {
        myChart1.value.resize();
        myChart2.value.resize();
        myChart3.value.resize();
      }, 500)();
    });
    resizeObserver.observe(chart1.value);
    resizeObserver.observe(chart2.value);
    resizeObserver.observe(chart3.value);

  });
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
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

.notice:hover {
  color: #66b1ff;
}

.text {
  font-size: 1.3em;
  margin-left: 10px;
}

.item {
  margin: 10px;
}
</style>
