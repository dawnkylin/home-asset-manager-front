<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- 用户资料卡 -->
      <el-col :span="8" :xs="24">
        <el-card>
          <template #header>
            <span>个人资料</span>
          </template>
          <div class="user-info">
            <!-- 头像 -->
            <el-avatar :size="75" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="username">{{ userInfo.username }}</div>
            <!-- 签名 -->
            <el-divider content-position="left">
              <el-icon>
                <EditPen />
              </el-icon>
              <span class="signature subtitle">签名</span>
            </el-divider>
            <div class="signature">{{ userInfo.signature === '' || userInfo.signature === undefined ? "空空如也~~" :
              userInfo.signature }}
            </div>
            <!-- 家庭名 -->
            <el-divider content-position="left">
              <el-icon>
                <House />
              </el-icon>
              <span class="family-name subtitle">家庭名</span>
            </el-divider>
            <div class="family-name">
              {{ userInfo.homeName === '' || userInfo.homeName === undefined ? "可怜的单身汉~~" : userInfo.homeName }}
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 操作选项卡 -->
      <el-col :span="16" :xs="24">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="个人信息" name="first">
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfo.phone" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="家庭序列号">
                <el-input v-model="userInfo.homeSerialNumber" disabled></el-input>
              </el-form-item>
              <el-form-item label="签名">
                <el-input v-model="userInfo.signature" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="注册时间">
                <el-input v-model="userInfo.createdTime" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">{{ btnName }}</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="旧密码">
                <el-input v-model="userInfo.oldPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="新密码">
                <el-input v-model="userInfo.newPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input v-model="userInfo.confirmPassword" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 家庭 -->
          <el-tab-pane label="家庭" name="third">
            <el-divider>
              <div class="subtitle">家庭成员</div>
            </el-divider>
            <el-table :data="homeTableData" style="width: 100%">
              <el-table-column prop="name" label="姓名" min-width="180"></el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="180"></el-table-column>
              <el-table-column label="操作" width="180">
                <template #default="scope">
                  <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-divider>
              <div class="subtitle">创建或加入家庭</div>
            </el-divider>
            <!-- 打开创建家庭Dialog -->
            <el-button type="primary" @click="createHomeDialogVisible = true">创建我的家庭</el-button>
            <!-- 打开加入家庭Dialog -->
            <el-button type="primary" @click="joinHomeDialogVisible = true">加入家庭</el-button>
          </el-tab-pane>
          <!-- 验证通知和请求加入通知 -->
          <el-tab-pane label="通知" name="fourth">
            <el-divider>
              <div class="subtitle">
                审核通知
              </div>
            </el-divider>
            <el-table :data="verifyNoticeData" style="width: 100%">
              <el-table-column prop="recipientName" label="审核人姓名" min-width="180"></el-table-column>
              <el-table-column prop="homeSerialNumber" label="申请家庭序列号" min-width="180"></el-table-column>
              <el-table-column prop="status" label="结果" width="180">
                <template #default="scope">
                  <el-tag type="success" v-if="scope.row.status === 1">通过</el-tag>
                  <el-tag type="danger" v-else>拒绝</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-divider>
              <div class="subtitle">
                请求加入通知
              </div>
            </el-divider>
            <el-table :data="joinNoticeData" style="width: 100%">
              <el-table-column prop="name" label="姓名" min-width="180"></el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="180"></el-table-column>
              <el-table-column prop="status" label="操作" width="180">
                <template #default="scope">
                  <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">同意</el-button>
                  <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>

  <!-- 创建家庭的Dialog -->
  <el-dialog title="创建家庭" v-model="createHomeDialogVisible">
    <el-form :model="newHomeForm" label-width="100px">
      <el-form-item label="家庭名">
        <el-input v-model="newHomeForm.homeName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="createHome">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 加入家庭的Dialog -->
  <el-dialog title="加入家庭" v-model="joinHomeDialogVisible">
    <el-form :model="joinHomeForm" label-width="100px">
      <el-form-item label="家庭序列号">
        <el-input v-model="joinHomeForm.homeSerialNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="joinHome">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "ProfilePage"
}
</script>
<script setup>
import { computed, ref } from "vue";
import { getLocalStorage } from "@utils/storage";


const userInfo = computed(() => getLocalStorage("user"));

const activeName = ref("first");

const isDisabled = ref(true);

const btnName = ref("编辑");

const homeTableData = ref([
  {
    name: "张三",
    phone: "12345678901"
  },
  {
    name: "李四",
    phone: "12345678901"
  },
  {
    name: "王五",
    phone: "12345678901"
  }
]);

const verifyNoticeData = ref([
  {
    recipientName: "张三",
    homeSerialNumber: "12345678901",
    status: 1
  },
  {
    recipientName: "李四",
    homeSerialNumber: "12345678901",
    status: 0
  },
  {
    recipientName: "王五",
    homeSerialNumber: "12345678901",
    status: 1
  }
]);

const joinNoticeData = ref([
  {
    name: "张三",
    phone: "12345678901",
    status: 1
  },
  {
    name: "李四",
    phone: "12345678901",
    status: 0
  },
  {
    name: "王五",
    phone: "12345678901",
    status: 1
  }
]);

const submit = () => {
  if (btnName.value === "编辑") {
    isDisabled.value = false;
    btnName.value = "提交";
  } else {
    isDisabled.value = true;
    btnName.value = "编辑";
  }
};

const handleEdit = (index, row) => {
  console.log(index, row);
};

const handleDelete = (index, row) => {
  console.log(index, row);
};

const createHomeDialogVisible = ref(false);

const newHomeForm = ref({
  homeName: ""
});

const createHome = () => {
  console.log(newHomeForm.value);
};

const joinHomeDialogVisible = ref(false);

const joinHomeForm = ref({
  homeSerialNumber: ""
});

const joinHome = () => {
  console.log(joinHomeForm.value);
};

</script>
<style lang="scss" scoped>
.container {
  min-height: 100%;
  background-image: url("@assets/images/about_bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  // 滚动位置不变
  background-attachment: fixed;
  margin-top: -1rem;
  .subtitle {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 10px;
  }
}

.user-info {
  text-align: center;

  .username {
    font-size: 20px;
    font-weight: 600;
    margin-top: 10px;
  }
}

.el-row {
  margin-right: 0 !important;
  padding: 1rem;
}
</style>
