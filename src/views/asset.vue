<template>
  <el-row :gutter="20">
    <!-- 搜索栏 -->
    <el-col :span="4" :xs="24">
      <el-select v-model="searchType" placeholder="请选择搜索类型" size="large">
        <el-option label="名称" value="name"></el-option>
        <el-option label="类型" value="assetType"></el-option>
        <el-option label="价格" value="purchasePrice"></el-option>
        <el-option label="购买日期" value="purchaseDate"></el-option>
        <el-option label="当前价值" value="currentValue"></el-option>
        <el-option label="备注" value="notes"></el-option>
      </el-select>
    </el-col>
    <el-col :span="5" :xs="24">
      <el-input v-model="search" placeholder="请输入搜索内容" clearable @clear="handleSearch" size="large">
        <template #append>
          <el-button :icon="Search" @click="handleSearch">
          </el-button>
        </template>
      </el-input>
    </el-col>
    <el-col :span="3.5" :xs="24">
      <el-button type="primary" @click="handleAdd" size="large">添加</el-button>
      <el-button type="primary" @click="handleImport" size="large">批量删除</el-button>
    </el-col>
    <el-col :span="3" :xs="24">
      <el-button type="primary" @click="handleExport" size="large">导出</el-button>
      <el-button type="primary" @click="handleImport" size="large">导入</el-button>
    </el-col>
  </el-row>
  <el-row>
    <!-- 资产表格 -->
    <el-table :data="tableData" stripe border @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#0e4b41', color: 'white' }">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column prop="assetTypeName" label="类型" show-overflow-tooltip width="100">
        <!-- 不同的类型显示不同颜色的el-tag -->
        <template #default="{ row }">
          <el-tag v-if="row.assetTypeName === '房产'" color="	#8B658B">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '车辆'" color="#F8F8FF">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '金融资产'" color="#DCDCDC">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '家居用品'" color="#668B8B">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '电子产品'" color="#00F5FF">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '生活用品'" color="#7FFFD4">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '教育支出'" color="#6495ED">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '医疗支出'" color="#2E8B57">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '旅游支出'" color="#4682B4">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '其他'" color="black">{{ row.assetTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" label="购买价格" sortable show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="purchaseDate" label="购买日期" sortable show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="currentValue" label="当前价值" sortable show-overflow-tooltip width=120></el-table-column>
      <el-table-column prop="notes" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="primary" round @click="handleEdit(row)">编辑</el-button>
          <el-button type="success" round @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <!-- 分页 -->
  <el-row>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :total="total" background layout="total,sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </el-row>
</template>
<script>
export default {
  name: 'AssetPage',
};
</script>
<script setup>
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import axios from "@utils/request";
import { getLocalStorage } from '@utils/storage';

// 搜索栏
const searchType = ref();
const search = ref();
const handleSearch = () => {
  console.log(searchType.value, search.value);
};

const handleAdd = () => {
  console.log('添加');
};
const handleImport = () => {
  console.log('导入');
};
const handleExport = () => {
  console.log('导出');
};

// 表格
const handleSelectionChange = (val) => {
  console.log(val);
};

const handleEdit = (row) => {
  console.log(row);
};

const handleDelete = (row) => {
  console.log(row);
};

// 分页
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref();
const handleSizeChange = (val) => {
  pageSize.value = val;
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 表格数据
const tableData = ref([]);

const getTableData = () => {
  axios.getRequest(
    '/asset/getAssetList/' + getLocalStorage("user").id + '?pageNum=' + currentPage.value +
    '&pageSize=' + pageSize.value
  ).then((res) => {
    tableData.value = res.data;
    total.value = res.data.length;
  });
};

onMounted(() => {
  // 获取表格数据
  getTableData();
});
</script>
<style scoped lang="scss">
.el-row {
  margin-right: 0 !important;
  padding: 1rem;
}
</style>
