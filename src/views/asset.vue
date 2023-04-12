<template>
  <el-row :gutter="20">
    <!-- 搜索栏 -->
    <el-col :span="4" :xs="24">
      <el-select v-model="searchType" placeholder="请选择搜索类型" size="large" clearable>
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
    <!-- 添加、批量删除按钮 -->
    <el-col :span="3.5" :xs="24">
      <el-button type="primary" @click="handleAdd" size="large">添加</el-button>
      <el-popconfirm title="确定删除选中的资产吗?" @confirm="handleBatchDelete">
        <template #reference>
          <el-button type="primary" size="large">批量删除</el-button>
        </template>
      </el-popconfirm>
    </el-col>
    <!-- 导出、导入按钮 -->
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
          <el-tag v-else-if="row.assetTypeName === '家居用品'" color="#5D478B">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '电子产品'" color="#00F5FF">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '生活用品'" color="#7FFFD4">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '教育'" color="#006400">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '医疗'" color="#2E8B57">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '旅游'" color="#4682B4">{{ row.assetTypeName }}</el-tag>
          <el-tag v-else-if="row.assetTypeName === '其他'" color="black">{{ row.assetTypeName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="purchasePrice" label="购买价格" sortable show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="purchaseDate" label="购买日期" sortable show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="currentValue" label="当前价值" sortable show-overflow-tooltip width=120></el-table-column>
      <el-table-column prop="userName" label="创建者" show-overflow-tooltip width="100"></el-table-column>
      <el-table-column prop="notes" label="备注" show-overflow-tooltip min-width="100"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="220">
        <template #default="{ row }">
          <el-button type="primary" round @click="handleEdit(row)">编辑</el-button>
          <el-popconfirm title="确定删除该资产吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="danger" round>删除</el-button>
            </template>
          </el-popconfirm>
          <!-- 复制资产序列号 -->
          <el-popover placement="top-start" :width="200" trigger="hover" content="点击复制资产序列号">
            <template #reference>
              <el-button type="primary" @click="copySerialNumber(row)" :icon="DocumentCopy"></el-button>
            </template>
          </el-popover>
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
        <el-input v-model="addForm.notes" type="textarea" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="addDialogVisible = false">取消</el-button>
      <el-button type="success" @click="addFormSubmit">确定</el-button>
    </template>
  </el-dialog>
  <!-- 编辑 Dialog -->
  <el-dialog title="编辑资产" v-model="editDialogVisible" width="30%" align-center>
    <el-form :model="editForm" label-width="auto" ref="editFormRef" :rules="editFormRules">
      <!-- 资产名称 -->
      <el-form-item label="资产名称" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入资产名称"></el-input>
      </el-form-item>
      <!-- 资产类型 -->
      <el-form-item label="资产类型" prop="assetTypeId">
        <el-select v-model="editForm.assetTypeId" placeholder="请选择资产类型">
          <el-option v-for="item in assetTypeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 购买价格 -->
      <el-form-item label="购买价格" prop="purchasePrice">
        <el-input v-model="editForm.purchasePrice" placeholder="请输入购买价格"></el-input>
      </el-form-item>
      <!-- 购买日期 -->
      <el-form-item label="购买日期" prop="purchaseDate">
        <el-date-picker v-model="editForm.purchaseDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <!-- 当前价值 -->
      <el-form-item label="当前价值" prop="currentValue">
        <el-input v-model="editForm.currentValue" placeholder="请输入当前价值"></el-input>
      </el-form-item>
      <!-- 备注 -->
      <el-form-item label="备注" prop="notes">
        <el-input v-model="editForm.notes" type="textarea" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="editDialogVisible = false">取消</el-button>
      <el-popconfirm title="确定修改该资产吗？" @confirm="editFormSubmit">
        <template #reference>
          <el-button type="success">确定</el-button>
        </template>
      </el-popconfirm>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: 'AssetPage',
};
</script>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { Search, DocumentCopy } from '@element-plus/icons-vue';
import axios from "@utils/request";
import { getLocalStorage } from '@utils/storage';
import { ElNotification } from 'element-plus';
import * as XLSX from 'xlsx';
import { useRoute, } from 'vue-router';

// 复制序列号到剪切板
const copySerialNumber = (row) => {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', row.assetSerialNumber);
  document.body.appendChild(input);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    ElNotification({
      title: '复制成功',
      message: '序列号已复制到剪切板',
      type: 'success',
    });
  }
  document.body.removeChild(input);
};

// 搜索栏
const searchType = ref('');

const search = ref('');

const handleSearch = () => {
  getTableData();
};

/**
 *
 * 添加相关
 *
 */

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
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  currentValue: [
    { required: true, message: '请输入当前价值', trigger: 'blur' },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
});

const addFormSubmit = () => {
  // 表单验证
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求添加资产
      const res = await axios.postRequest('/asset/addAsset', addForm.value);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '添加资产成功',
          type: 'success',
        });
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
    name: '教育',
  },
  {
    id: 8,
    name: '旅游',
  },
  {
    id: 9,
    name: '医疗',
  },
  {
    id: 10,
    name: '其他',
  },
]);

const handleAdd = () => {
  // 弹出添加 Dialog
  addDialogVisible.value = true;
  // 清空表单
  addForm.value = {
    name: '',
    userId: getLocalStorage('user').id,
    assetTypeId: '',
    purchasePrice: '',
    purchaseDate: '',
    currentValue: '',
    notes: '',
  };
};

/**
 *
 * 编辑相关
 *
 */

const editDialogVisible = ref(false);

const editForm = ref({
  id: '',
  name: '',
  userId: getLocalStorage('user').id,
  assetTypeId: '',
  purchasePrice: '',
  purchaseDate: '',
  currentValue: '',
  notes: '',
});

const handleEdit = (row) => {
  // 弹出编辑 Dialog
  editDialogVisible.value = true;
  // 把当前行数据赋值给编辑表单，不与row绑定
  editForm.value = {
    id: row.id,
    name: row.name,
    userId: row.userId,
    assetTypeId: row.assetTypeId,
    assetTypeName: row.assetTypeName,
    purchasePrice: row.purchasePrice,
    purchaseDate: row.purchaseDate,
    currentValue: row.currentValue,
    notes: row.notes,
  }
};

const editFormRef = ref();

// 编辑表单验证
const editFormRules = ref({
  name: [
    { required: true, message: '请输入资产名称', trigger: 'blur' },
  ],
  assetTypeId: [
    { required: true, message: '请选择资产类型', trigger: 'blur' },
  ],
  purchasePrice: [
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  currentValue: [
    { required: true, message: '请输入当前价值', trigger: 'blur' },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
});

// 提交编辑表单
const editFormSubmit = () => {
  // 表单验证
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求编辑资产
      const res = await axios.postRequest('/asset/updateAsset', editForm.value);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '编辑资产成功',
          type: 'success',
        });
        editDialogVisible.value = false;
        getTableData();
      }
    }
  });
};

/**
 *
 * 导入导出相关
 *
 */

const handleImport = () => {
  // 创建一个 input 标签
  const input = document.createElement('input');
  // 设置 input 标签的 type 属性为 file
  input.type = 'file';
  // 监听 input 标签的 change 事件，当文件选择完成后触发
  input.onchange = async (e) => {
    // 获取文件, e.target.files[0] 为选择的第一个文件
    const file = e.target.files[0];
    // 检查文件类型
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      ElNotification({
        title: '错误',
        message: '文件类型错误',
        type: 'error',
      });
      return;
    }
    // 读取文件
    const reader = new FileReader();
    // 读取文件为二进制字符串
    reader.readAsBinaryString(file);
    reader.onload = async (e) => {
      // 读取完成
      const data = e.target.result;
      // 将文件转换为工作簿
      const wb = XLSX.read(data, { type: 'binary' });
      // 获取工作表，wb.SheetNames[0] 为第一个工作表的名称
      const ws = wb.Sheets[wb.SheetNames[0]];
      // 将工作表转换为 JSON 数组
      const list = XLSX.utils.sheet_to_json(ws);
      // 将每个元素的资产类型ID设置为资产类型的对应ID
      list.forEach((item) => {
        const assetType = assetTypeList.value.find((assetType) => assetType.name === item.assetType);
        item.assetTypeId = assetType.id;
        item.userId = getLocalStorage('user').id;
      });
      // 发送请求导入资产
      const res = await axios.postRequest('/asset/addAssetList', list);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '导入资产成功',
          type: 'success',
        });
        getTableData();
      }
    };
  };
  // 触发 input 标签的 click 事件，打开文件选择框
  input.click();
};
const handleExport = () => {
  // 没有选中的资产
  if (selectedAssets.value.length === 0) {
    ElNotification({
      title: '提示',
      message: '请先选择要导出的资产',
      type: 'warning',
    });
    return;
  }
  // 将选中的资产数据导出,除了 id、userId、assetTypeId的其他字段
  const list = selectedAssets.value.map((item) => {
    return {
      name: item.name,
      assetType: item.assetTypeName,
      purchasePrice: item.purchasePrice,
      purchaseDate: item.purchaseDate,
      currentValue: item.currentValue,
      notes: item.notes,
    };
  });
  // 创建一个工作簿
  const wb = XLSX.utils.book_new();
  // 创建一个工作表
  const ws = XLSX.utils.json_to_sheet(list);
  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, '资产列表');
  // 导出 Excel
  XLSX.writeFile(wb, '资产列表.xlsx');
};


/**
 *
 * 删除相关
 *
 */

const handleDelete = (row) => {
  // 删除资产
  axios.postRequest('/asset/deleteAsset/' + row.id).then((res) => {
    if (res.code === 200) {
      ElNotification({
        title: '成功',
        message: '删除资产成功',
        type: 'success',
      });
      getTableData();
    }
  });
};

const selectedAssets = ref([]);

// 表格
const handleSelectionChange = (val) => {
  // 把选中的资产赋值给选中的资产数组
  selectedAssets.value = val;
};

const handleBatchDelete = () => {
  // 没有选中的资产
  if (selectedAssets.value.length === 0) {
    ElNotification({
      title: '警告',
      message: '请先选择要删除的资产',
      type: 'warning',
    });
    return;
  }
  // 发送请求批量删除选中的资产
  const assetIdList = [];
  selectedAssets.value.forEach((item) => {
    assetIdList.push(item.id);
  });
  axios.postRequest('/asset/deleteAssetList', assetIdList).then((res) => {
    if (res.code === 200) {
      ElNotification({
        title: '成功',
        message: '批量删除资产成功',
        type: 'success',
      });
      getTableData();
    }
  });
};

/**
 * 分页相关
 */
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref();
const handleSizeChange = (val) => {
  pageSize.value = val;
  getTableData();
};
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getTableData();
};

// 表格数据
const tableData = ref([]);

const loading = ref(true);

const route = useRoute();

// 获取路由的meta中的type
const type = ref(route.meta.type);

// 获取表格数据
const getTableData = () => {
  axios.getRequest(
    '/asset/getAssetList' + '?userId=' + getLocalStorage("user").id +
    '&homeSerialNumber=' + getLocalStorage("user").homeSerialNumber +
    '&pageNum=' + currentPage.value +
    '&pageSize=' + pageSize.value +
    '&searchType=' + searchType.value +
    '&searchValue=' + search.value +
    '&type=' + type.value
  ).then((res) => {
    tableData.value = res.data.list;
    // 延时1s
    setTimeout(() => {
      loading.value = false;
    }, 500);
    total.value = res.data.total;
  })
    // 没有数据
    // eslint-disable-next-line no-unused-vars
    .catch((e) => {
      tableData.value = [];
      loading.value = false;
      total.value = 0;
    })
};

onMounted(() => {
  // 获取表格数据
  getTableData();
});

// const router = useRouter();

// 监听路由变化时，重新获取表格数据
watch(
  // 监听路由变化
  () => route.path,
  // 回调函数
  // eslint-disable-next-line no-unused-vars
  (_to, _from) => {
    // 获取to对应路由的meta中的type，to是路径字符串
    type.value = route.meta.type;
    // 获取表格数据
    loading.value = true;
    getTableData();
  }
)
</script>
<style scoped lang="scss">
.el-row {
  margin-right: 0 !important;
  padding: 1rem;
}
</style>
