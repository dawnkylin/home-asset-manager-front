<template>
  <!-- 添加公告按钮 -->
  <el-button type="primary" @click="addSystemNotice">添加公告</el-button>
  <!-- 系统公告表格 -->
  <el-table :data="systemNotices" border style="width: 100%" :header-cell-style="{
    backgroundColor: '#F5F7FA',
    color: '#909399',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  }">
    <!-- 内容和创建时间 -->
    <el-table-column prop="content" label="内容" min-width="500" :header-cell-style="{
      backgroundColor: '#F5F7FA',
      color: '#909399',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '16px'
    }">
    </el-table-column>
    <el-table-column prop="createdDate" label="创建时间" min-width="200" :header-cell-style="{
      backgroundColor: '#F5F7FA',
      color: '#909399',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '16px'
    }">
    </el-table-column>
    <!-- 操作 -->
    <el-table-column label="操作" width="200" :header-cell-style="{
      backgroundColor: '#F5F7FA',
      color: '#909399',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '16px'
    }">
      <template #default="{ row }">
        <el-button type="primary" size="small" @click="editSystemNotice(row)">编辑</el-button>
        <el-popconfirm title="确定删除吗？" confirmButtonText="确定" cancelButtonText="取消" @confirm="deleteSystemNotice(row)">
          <template #reference>
            <el-button type="danger" size="small">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加公告对话框 -->
  <el-dialog title="添加公告" v-model="addSystemNoticeDialogVisible" width="30%" align-center>
    <el-form :model="addSystemNoticeForm" label-width="auto" @keydown.enter.prevent>
      <el-form-item label="内容" prop="content">
        <el-input v-model="addSystemNoticeForm.content" type="textarea" autosize></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click.prevent="addSystemNoticeFormSubmit">提交</el-button>
      <el-button @click.prevent="addSystemNoticeDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
  <!-- 编辑公告对话框 -->
  <el-dialog title="编辑公告" v-model="editSystemNoticeDialogVisible" width="30%" align-center>
    <el-form :model="editSystemNoticeForm" label-width="auto" @keydown.enter.prevent>
      <el-form-item label="内容" prop="content">
        <el-input v-model="editSystemNoticeForm.content" type="textarea" autosize></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click.prevent="editSystemNoticeFormSubmit">提交</el-button>
      <el-button @click.prevent="editSystemNoticeDialogVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>
<script>
export default {
  name: "SystemNoticesPage",
};
</script>
<script setup>
import { ref, onMounted } from "vue";
import axios from "@utils/request.js"
import { ElMessage } from "element-plus";

const systemNotices = ref([]);

const addSystemNoticeDialogVisible = ref(false);
const addSystemNoticeForm = ref({
  id:"",
  content: "",
  createdDate: "",
});

const editSystemNoticeDialogVisible = ref(false);
const editSystemNoticeForm = ref({
  id:"",
  content: "",
  createdDate:""
});

const addSystemNotice = () => {
  addSystemNoticeDialogVisible.value = true;
};

// 添加系统公告表单提交
const addSystemNoticeFormSubmit = () => {
  //发送提交请求
  axios.postRequest("/notice/addNotice", addSystemNoticeForm.value)
    .then(res => {
      if (res.code === 200) {
        ElMessage.success("添加成功！");
        //重新获取全部公告
        getTableData();
      }
      else ElMessage.error(res.message);
    })
  addSystemNoticeDialogVisible.value = false;
};

const editSystemNotice = (row) => {
  editSystemNoticeDialogVisible.value = true;
  //将row的属性值赋值给editSystemNoticeForm
  editSystemNoticeForm.value.id = row.id
  editSystemNoticeForm.value.content = row.content
  editSystemNoticeForm.value.createdDate = row.createdDate
  console.log(row.content)
};

// 编辑系统公告表单提交
const editSystemNoticeFormSubmit = () => {
  //发送提交请求
  axios.postRequest("/notice/updateNotice", editSystemNoticeForm.value)
    .then(res => {
      if (res.code === 200) {
        ElMessage.success("修改成功！");
        //重新获取全部公告
        getTableData();
      }
      else ElMessage.error(res.message);
    })
  editSystemNoticeDialogVisible.value = false;
};

// 删除系统公告
const deleteSystemNotice = (row) => {
  //发送删除请求
  axios.postRequest("/notice/deleteNotice/"+ row.id)
    .then(res => {
      if (res.code === 200) {
        ElMessage.success("删除成功！");
        //重新获取全部公告
        getTableData();
      }
      else ElMessage.error(res.message);
    })
};

const getTableData = () => {
  //发送请求获取公告数据
  axios.getRequest("/notice/getNotices")
    .then(res => {
      if (res.code === 200) {
        systemNotices.value = res.data;
      }
      else ElMessage.error(res.message);
    });
}

onMounted(() => {
  //获取全部公告
  getTableData();
})
</script>
