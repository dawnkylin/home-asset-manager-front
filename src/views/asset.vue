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
    <el-table :data="tableData" v-loading="loading" stripe border @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#1C1C1C', color: 'white' }">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip width="130"></el-table-column>
      <el-table-column prop="assetTypeName" label="类型" show-overflow-tooltip width="100">
        <!-- 不同的类型显示不同颜色的el-tag -->
        <template #default="{ row }">
          <el-tag v-if="row.assetTypeName === '房产'" color="	#8B658B">{{ row.assetTypeName
          }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '车辆'" color="#F8F8FF">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '金融资产'" color="#DCDCDC">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '家居用品'" color="#668B8B">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '电子产品'" color="#00F5FF">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '生活用品'" color="#7FFFD4">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '教育支出'" color="#006400">{{ row.assetTypeName }}</el-tag>
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
      :total="total" :background="true" layout="total,sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </el-row>

  <!-- 添加 Dialog -->
  <el-dialog title="添加资产" v-model="addDialogVisible" width="30%" align-center>
    <el-form :model="addForm" label-width="auto" ref="addFormRef" :rules="addFormRules">
      <!-- 资产名称 -->
      <el-form-item label="资产名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入资产名称"></el-input>
      </el-form-item>
      <!-- 资产类型 -->
      <el-form-item label="资产类型" prop="assetTypeId">
        <el-select v-model="addForm.assetTypeId" placeholder="请选择资产类型">
          <el-option v-for="item in assetTypeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 购买价格 -->
      <el-form-item label="购买价格" prop="purchasePrice">
        <el-input v-model="addForm.purchasePrice" placeholder="请输入购买价格"></el-input>
      </el-form-item>
      <!-- 购买日期 -->
      <el-form-item label="购买日期" prop="purchaseDate">
        <el-date-picker v-model="addForm.purchaseDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <!-- 当前价值 -->
      <el-form-item label="当前价值" prop="currentValue">
        <el-input v-model="addForm.currentValue" placeholder="请输入当前价值"></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注" prop="notes">
        <el-input v-model="addForm.notes" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="addDialogVisible = false">取消</el-button>
      <el-button type="success" @click="addFormSubmit">确定</el-button>
    </template>
  </el-dialog>
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

// 添加 Dialog
const addDialogVisible = ref(false);
const addForm = ref({
  name: '',
  userId: getLocalStorage('user').id,
  assetTypeId: '',
  purchasePrice: '',
  purchaseDate: '',
  currentValue: '',
  notes: '',
});

const addFormRef = ref();

// 添加表单验证
const addFormRules = ref({
  name: [
    { required: true, message: '请输入资产名称', trigger: 'blur' },
  ],
  assetTypeId: [
    { required: true, message: '请选择资产类型', trigger: 'blur' },
  ],
  purchasePrice: [
    { required: true, message: '请输入购买价格', trigger: 'blur' },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  purchaseDate: [
    { required: true, message: '请选择购买日期', trigger: 'blur' },
  ],
  currentValue: [
    { required: true, message: '请输入当前价值', trigger: 'blur' },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  notes: [
    { required: true, message: '请输入备注', trigger: 'blur' },
  ],
});

const addFormSubmit = () => {
  // 表单验证
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求添加资产
      const res = await axios.postRequest('/asset/addAsset', addForm.value);
      if (res.code === 200) {
        addDialogVisible.value = false;
        getTableData();
      }
    }
  });
};

const assetTypeList = ref([
  {
    id: 1,
    name: '房产',
  },
  {
    id: 2,
    name: '车辆',
  },
  {
    id: 3,
    name: '金融资产',
  },
  {
    id: 4,
    name: '家居用品',
  },
  {
    id: 5,
    name: '电子产品',
  },
  {
    id: 6,
    name: '生活用品',
  },
  {
    id: 7,
    name: '教育支出',
  },
  {
    id: 8,
    name: '旅游支出',
  },
  {
    id: 9,
    name: '医疗支出',
  },
  {
    id: 10,
    name: '其他',
  },
]);

const handleAdd = () => {
  // 弹出添加 Dialog
  addDialogVisible.value = true;
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

const loading = ref(true);

// 获取表格数据
const getTableData = () => {
  axios.getRequest(
    '/asset/getAssetList/' + getLocalStorage("user").id + '?pageNum=' + currentPage.value +
    '&pageSize=' + pageSize.value
  ).then((res) => {
    tableData.value = res.data;
    // 延时1s
    setTimeout(() => {
      loading.value = false;
    }, 1000);
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
