<template>
  <el-row :gutter="20">
    <!-- 搜索栏 -->
    <el-col :span="4" :xs="24">
      <el-select v-model="searchType" placeholder="请选择搜索类型" size="large" clearable>
        <el-option label="名称" value="name"></el-option>
        <el-option label="记录日期" value="createdDate"></el-option>
        <el-option label="备注" value="notes"></el-option>
        <el-option label="关联资产序列号" value="assetSerialNumber"></el-option>
        <el-option label="金额" value="amount"></el-option>
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
      <el-popconfirm title="确定删除选中的记录吗?" @confirm="handleBatchDelete">
        <template #reference>
          <el-button type="primary" size="large">批量删除</el-button>
        </template>
      </el-popconfirm>
    </el-col>
    <!-- 导出、导入按钮 -->
    <el-col :span="3.5" :xs="24">
      <el-button type="primary" @click="handleExport" size="large">导出</el-button>
      <el-button type="primary" @click="handleImport" size="large">导入</el-button>
    </el-col>
    <!-- 选择展示方式 -->
    <el-col :span="3.5" :xs="24">
      <el-switch v-model="isCard" active-text="卡片" inactive-text="表格" active-color="#13ce66" inactive-color="#ff4949" />
    </el-col>
  </el-row>
  <el-row>
    <!-- 财务表格 -->
    <el-table v-show="!isCard" :data="tableData" v-loading="loading" stripe border
      @selection-change="handleSelectionChange" :header-cell-style="{ background: '#1C1C1C', color: 'white' }">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="名称" show-overflow-tooltip width="130"></el-table-column>
      <el-table-column prop="amount" label="金额" sortable show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="createdDate" label="记录日期" sortable show-overflow-tooltip width="150"></el-table-column>
      <el-table-column prop="userName" label="创建者" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="notes" label="备注" show-overflow-tooltip min-width="200"></el-table-column>
      <el-table-column prop="assetSerialNumber" label="关联资产序列号" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="200">
        <template #default="{ row }">
          <el-button type="primary" round @click="handleEdit(row)">编辑</el-button>
          <el-popconfirm title="确定删除该记录吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="danger" round>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <!-- 以卡片形式显示数据 -->
  <el-row>
    <el-space v-show="isCard" wrap>
      <el-card class="box-card" v-for="item in tableData" :key="item.id"
        :body-style="{ padding: '20px'}">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <div>
              <el-button :icon="Edit" round @click="handleEdit(item)">
              </el-button>
              <el-popconfirm title="确定删除该记录吗？" @confirm="handleDelete(item)">
                <template #reference>
                  <el-button :icon="Delete" type="danger" round></el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </template>
        <div class="card-body">
          <div>
              <el-tag type="success">金额</el-tag>
              <span>{{ item.amount }}</span>
            </div>
            <div>
              <el-tag type="success">记录日期</el-tag>
              <span>{{ item.createdDate }}</span>
            </div>
            <div>
              <el-tag type="success">创建者</el-tag>
              <span>{{ item.userName }}</span>
            </div>
            <div>
              <el-tag type="success">备注</el-tag>
              <span class="card-text-break">{{ item.notes }}</span>
            </div>
            <div>
              <el-tag type="success">关联资产序列号</el-tag>
              <span class="card-text-break">{{ item.assetSerialNumber }}</span>
            </div>
        </div>
      </el-card>
    </el-space>
  </el-row>
  <!-- 分页 -->
  <el-row>
    <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :total="total" :background="true" layout="total,sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </el-row>
  <!-- 添加 Dialog -->
  <el-dialog title="添加财务记录" v-model="addDialogVisible" width="30%" align-center>
    <el-form :model="addForm" label-width="auto" ref="addFormRef" :rules="addFormRules">
      <!-- 名称 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <!-- 财务类型 -->
      <el-form-item label="财务类型" prop="type">
        <el-select v-model="addForm.type" placeholder="请选择财务类型">
          <el-option label="收入" value="1"></el-option>
          <el-option label="支出" value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- 金额 -->
      <el-form-item label="金额" prop="amount">
        <el-input v-model="addForm.amount" placeholder="请输入金额"></el-input>
      </el-form-item>
      <!-- 记录日期 -->
      <el-form-item label="记录日期" prop="createdDate">
        <el-date-picker v-model="addForm.createdDate" type="createdDate" placeholder="选择日期" value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <!-- 财务备注 -->
      <el-form-item label="财务备注" prop="notes">
        <el-input v-model="addForm.notes" placeholder="请输入备注"></el-input>
      </el-form-item>
      <!-- 关联资产序列号 -->
      <el-form-item label="关联资产序列号" prop="assetSerialNumber">
        <el-input v-model="addForm.assetSerialNumber" placeholder="请输入关联资产序列号"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="addDialogVisible = false">取消</el-button>
      <el-button type="success" @click="addFormSubmit">确定</el-button>
    </template>
  </el-dialog>
  <!-- 编辑 Dialog -->
  <el-dialog title="编辑财务" v-model="editDialogVisible" width="30%" align-center>
    <el-form :model="editForm" label-width="auto" ref="editFormRef" :rules="editFormRules">
      <!-- 名称 -->
      <el-form-item label="名称" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <!-- 财务类型 -->
      <el-form-item label="财务类型" prop="type">
        <el-select v-model="editForm.type" placeholder="请选择财务类型">
          <el-option label="收入" value="1"></el-option>
          <el-option label="支出" value="0"></el-option>
        </el-select>
      </el-form-item>
      <!-- 金额 -->
      <el-form-item label="金额" prop="amount">
        <el-input v-model="editForm.amount" placeholder="请输入金额"></el-input>
      </el-form-item>
      <!-- 记录日期 -->
      <el-form-item label="记录日期" prop="createdDate">
        <el-date-picker v-model="editForm.createdDate" type="createdDate" placeholder="选择日期" value-format="YYYY-MM-DD">
        </el-date-picker>
      </el-form-item>
      <!-- 财务备注 -->
      <el-form-item label="财务备注" prop="notes">
        <el-input v-model="editForm.notes" placeholder="请输入财务备注"></el-input>
      </el-form-item>
      <!-- 关联资产序列号 -->
      <el-form-item label="关联资产序列号" prop="assetSerialNumber">
        <el-input v-model="editForm.assetSerialNumber" placeholder="请输入关联资产序列号"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="editDialogVisible = false">取消</el-button>
      <el-popconfirm title="确定修改该记录吗？" @confirm="editFormSubmit">
        <template #reference>
          <el-button type="success">确定</el-button>
        </template>
      </el-popconfirm>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: "FinancePage",
};
</script>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { Search, Edit, Delete } from '@element-plus/icons-vue';
import axios from "@utils/request";
import { getLocalStorage, } from '@utils/storage';
import { ElNotification } from 'element-plus';
import * as XLSX from 'xlsx';
import { useRoute, } from 'vue-router';
// import moment from 'moment';

const isCard = ref(true);

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


const route = useRoute();

// 添加 Dialog
const addDialogVisible = ref(false);
const addForm = ref({
  name: '',
  notes: '',
  userId: getLocalStorage('user').id,
  type: route.meta.type === 'income' ? 1 : 0,
  amount: '',
  createdDate: '',
  homeSerialNumber: getLocalStorage('user').homeSerialNumber,
});

const addFormRef = ref();

// 添加表单验证
const addFormRules = ref({
  name: [
    {
      required: true,
      message: '请输入财务名称',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择财务类型',
      trigger: 'change',
    },
  ],
  amount: [
    {
      required: true,
      message: '请输入金额',
      trigger: 'blur',
    },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  createdDate: [
    {
      required: true,
      message: '请选择记录日期',
      trigger: 'change',
    },
  ],
});

const addFormSubmit = () => {
  // 表单验证
  addFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求添加资产
      const res = await axios.postRequest('/finance/addFinance', addForm.value);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '添加财务记录成功',
          type: 'success',
        });
        addDialogVisible.value = false;
        getTableData();
      }
      else if (res.code === 1008) {
        // 序列号不存在
        ElNotification({
          title: '失败',
          message: res.message,
          type: 'error',
        });
      }
    }
  });
};

const handleAdd = () => {
  // 弹出添加 Dialog
  addDialogVisible.value = true;
  // 清空表单
  addForm.value = {
    name: '',
    notes: '',
    userId: getLocalStorage('user').id,
    type: '',
    amount: '',
    createdDate: '',
    assetSerialNumber: '',
    homeSerialNumber: getLocalStorage('user').homeSerialNumber,
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
  type: '',
  assetSerialNumber: '',
  createdDate: '',
  amount: '',
  notes: ''
});

const handleEdit = (row) => {
  // 弹出编辑 Dialog
  editDialogVisible.value = true;
  // 把当前行数据赋值给编辑表单，不与row绑定
  editForm.value = {
    id: row.id,
    name: row.name,
    userId: row.userId,
    type: row.type === 1 ? "1" : "0",
    assetSerialNumber: row.assetSerialNumber,
    createdDate: row.createdDate,
    amount: row.amount,
    notes: row.notes
  }
};

const editFormRef = ref();

// 编辑表单验证
const editFormRules = ref({
  name: [
    {
      required: true,
      message: '请输入财务名称',
      trigger: 'blur',
    },
  ],
  type: [
    {
      required: true,
      message: '请选择财务类型',
      trigger: 'change',
    },
  ],
  amount: [
    {
      required: true,
      message: '请输入金额',
      trigger: 'blur',
    },
    { pattern: /^([1-9]\d{0,9}|0)(\.\d{1,2})?$/, message: '请输入正确数字值', trigger: 'blur' }
  ],
  createdDate: [
    {
      required: true,
      message: '请选择记录日期',
      trigger: 'change',
    },
  ],
});

// 提交编辑表单
const editFormSubmit = () => {
  // 表单验证
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      // 发送请求编辑资产
      const res = await axios.postRequest('/finance/updateFinance', editForm.value);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '编辑资产成功',
          type: 'success',
        });
        editDialogVisible.value = false;
        getTableData();
      }
      else if (res.code === 1008) {
        // 序列号不存在
        ElNotification({
          title: '失败',
          message: res.message,
          type: 'error',
        });
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
      // 设置userId
      list.forEach((item) => {
        item.userId = getLocalStorage('user').id;
      });
      // 发送请求导入资产
      const res = await axios.postRequest('/finance/addFinanceList', list);
      if (res.code === 200) {
        ElNotification({
          title: '成功',
          message: '导入资产成功',
          type: 'success',
        });
        getTableData();
      } else {
        ElNotification({
          title: '失败',
          message: res.message,
          type: 'error',
        });
      }
    };
  };
  // 触发 input 标签的 click 事件，打开文件选择框
  input.click();
};
const handleExport = () => {
  if (isCard.value) {
    ElNotification({
      title: '提示',
      message: '卡片模式下无法导出',
      type: 'warning',
    });
    return;
  }
  // 没有选中的财务
  if (selectedAssets.value.length === 0) {
    ElNotification({
      title: '提示',
      message: '请先选择要导出的财务',
      type: 'warning',
    });
    return;
  }
  // 将选中的财务数据导出,除了 id、userId的其他字段
  const list = selectedAssets.value.map((item) => {
    return {
      name: item.name,
      type: item.type,
      amount: item.amount,
      createdDate: item.createdDate,
      assetSerialNumber: item.assetSerialNumber,
      notes: item.notes,
    };
  });
  // 创建一个工作簿
  const wb = XLSX.utils.book_new();
  // 创建一个工作表
  const ws = XLSX.utils.json_to_sheet(list);
  // 将工作表添加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, '财务列表');
  // 导出 Excel
  XLSX.writeFile(wb, '财务列表.xlsx');
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
  axios.postRequest('/finance/deleteFinanceList', assetIdList).then((res) => {
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
const total = ref(0);
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

// 获取路由的meta中的type
const type = ref(route.meta.type);

// 获取表格数据
const getTableData = () => {
  axios.getRequest(
    '/finance/getFinanceList' + '?userId=' + getLocalStorage("user").id +
    '&homeSerialNumber=' + getLocalStorage("user").homeSerialNumber + '&pageNum=' + currentPage.value +
    '&pageSize=' + pageSize.value + '&searchType=' + searchType.value + '&searchValue=' + search.value +
    '&type=' + type.value
  ).then((res) => {
    //日期格式处理
    // res.data.list.forEach((item) => {
    //   item.createdDate = moment(item.createdDate).format('YYYY-MM-DD');
    // });
    tableData.value = res.data.list;
    // 延时0.5s
    setTimeout(() => {
      loading.value = false;
    }, 500);
    total.value = res.data.total;
  });
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
  (to, from) => {
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

.box-card {
  padding: .5rem;
  border-radius: 10px;
  width: fit-content;

  .card-header {
    display: flex;
    justify-content: space-between;
  }

  .card-text-break {
    white-space: normal;
    word-break: break-all;
    height: fit-content;
    max-width: 200px;
    display: inline-block;
  }
  .card-body{
    &>div{
      margin-bottom: .5rem;
      >span{
        margin-left: .5rem;
      }
    }
  }
}
</style>
