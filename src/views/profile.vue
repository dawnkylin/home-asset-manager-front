<template>
  <div class="container">
    <el-row :gutter="20">
      <!-- 用户资料卡 -->
      <el-col :span="8" :xs="24">
        <el-card>
          <template #header>
            <span>个人资料卡</span>
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
            <div class="signature">{{ userInfo.signature === '' || userInfo.signature === null ? "空空如也~~" :
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
              {{ userInfo.homeName === '' || userInfo.homeName === undefined ? "尊敬的单身贵族~~" : userInfo.homeName }}
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 操作选项卡 -->
      <el-col :span="16" :xs="24">
        <el-tabs v-model="activeName" type="border-card" @tab-change="tabChange">
          <el-tab-pane label="个人信息" name="first">
            <el-form :model="userInfo" ref="userInfoRef" :rules="userInfoRules" label-width="100px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfo.phone" disabled></el-input>
              </el-form-item>
              <el-form-item label="家庭序列号">
                <el-input v-model="userInfo.homeSerialNumber" disabled></el-input>
              </el-form-item>
              <el-form-item label="签名">
                <el-input v-model="userInfo.signature" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="注册时间">
                <el-input v-model="userInfo.createdDate" disabled></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateUserInfo">{{ btnName }}</el-button>
                <!-- 重置 -->
                <el-button type="info" @click="resetUserInfo">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="pwdForm" ref="pwdFormRef" :rules="pwdFormRules" label-width="100px">
              <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="pwdForm.oldPassword" type="password" clearable show-password></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="pwdForm.newPassword" type="password" clearable show-password></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="pwdForm.confirmPassword" type="password" clearable show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifyPwd">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!-- 家庭 -->
          <el-tab-pane label="家庭" name="third">
            <el-divider>
              <div class="subtitle">家庭成员</div>
            </el-divider>
            <el-table :data="homeMembersTable" style="width: 100%" v-loading>
              <el-table-column prop="username" label="姓名" width="180"></el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="180"></el-table-column>
              <el-table-column width="180">
                <template #default="{ row }">
                  <el-popconfirm v-if="isCreator && row.id != getLocalStorage('user').id" title="确定要删除该成员吗？"
                    @confirm="deleteHomeMember(row)">
                    <template #reference>
                      <el-button type="danger" size="small">删除</el-button>
                    </template>
                  </el-popconfirm>
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
            <el-table :data="verifyNoticeData">
              <el-table-column prop="recipientName" label="审核人姓名" width="120"></el-table-column>
              <el-table-column prop="createdDate" label="申请时间" width="150"></el-table-column>
              <el-table-column prop="homeSerialNumber" label="申请家庭序列号" width="320"></el-table-column>
              <el-table-column prop="status" min-width="130">
                <template #default="{row}">
                  <el-tag type="success" v-if="row.status === '1'">已通过</el-tag>
                  <el-tag type="danger" v-else-if="row.status==='2'">已拒绝</el-tag>
                  <el-tag type="warning" v-else-if="row.status==='0'">待审核</el-tag>
                  <el-tag type="info" v-else>你已被移除</el-tag>
                </template>
              </el-table-column>
            </el-table>
            <el-divider>
              <div class="subtitle">
                请求加入通知
              </div>
            </el-divider>
            <el-table :data="joinNoticeData">
              <el-table-column prop="applicationName" label="姓名" width="150"></el-table-column>
              <el-table-column prop="applicationPhone" label="手机号" width="150"></el-table-column>
              <el-table-column prop="status" width="150">
                <template #default="{ row }">
                  <el-popconfirm title="确定要通过该申请吗？" @confirm="agree(row)">
                    <template #reference>
                      <el-button type="text" size="small">通过</el-button>
                    </template>
                  </el-popconfirm>
                  <el-popconfirm title="确定要拒绝该申请吗？" @confirm="refuse(row)">
                    <template #reference>
                      <el-button type="text" size="small">拒绝</el-button>
                    </template>
                  </el-popconfirm>
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
        <el-button type="primary" @click.prevent="createHome">提交</el-button>
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
        <el-button type="primary" @click.prevent="joinHome">提交</el-button>
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
import { ref, onMounted } from "vue";
import axios from "@utils/request";
import { ElMessage } from "element-plus";
import { getLocalStorage, setLocalStorage } from "@utils/storage";

const userInfo = ref({
  username: '',
  phone: '',
  createdDate: '',
  signature: '',
  homeSerialNumber: '',
});

onMounted(() => {
  userInfo.value = getLocalStorage('user');
});

const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const pwdFormRef = ref(null);

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== pwdForm.value.newPassword) {
    callback('两次输入密码不一致!');
  } else {
    callback();
  }
};

const pwdFormRules = ref({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: '至少6位,至少包含一个字母和一个数字', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, message: '至少6位,至少包含一个字母和一个数字', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'change' },
  ],
});

const modifyPwd = () => {
  pwdFormRef.value.validate(async (valid) => {
    if (valid) {
      const res = await axios.postRequest('/auth/updatePassword?oldPwd=' +
        pwdForm.value.oldPassword + '&newPwd=' +
        pwdForm.value.newPassword + '&userId=' + getLocalStorage('user').id);
      if (res.code === 200) {
        ElMessage.success('修改成功');
        pwdForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        };
      } else {
        ElMessage.error(res.message);
      }
    }
  });
};

const activeName = ref("first");

const isDisabled = ref(true);

const btnName = ref("编辑");

const homeMembersTable = ref([]);

const verifyNoticeData = ref([]);

const getVerifyNoticeData = async () => {
  const res = await axios.getRequest('/homeRequest/getRequestList/' +
  getLocalStorage('user').id);
  if (res.code === 200) {
    verifyNoticeData.value = res.data;
  }
};

const joinNoticeData = ref([]);

const getJoinNoticeData = async () => {
  const res = await axios.getRequest('/homeRequest/getUnhandledRequestList/' +
  getLocalStorage('user').id);
  if (res.code === 200) {
    joinNoticeData.value = res.data;
  }
};

const userInfoRef = ref(null);

const userInfoRules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/, message: "2-10位，包括汉字、字母、数字和下划线", trigger: "blur" }
  ],
});

const updateUserInfo = () => {
  if (btnName.value === "编辑") {
    isDisabled.value = false;
    btnName.value = "提交";
  } else {
    userInfoRef.value.validate((valid) => {
      if (valid) {
        console.log(userInfo.value);
        axios.postRequest("/account/updateAccount", userInfo.value).then(res => {
          if (res.code === 200) {
            setLocalStorage('user', userInfo.value);
            ElMessage.success("修改成功");
          }
          else {
            userInfo.value = getLocalStorage('user');
            ElMessage.error("修改失败");
          }
        });
        isDisabled.value = true;
        btnName.value = "编辑";
      }
    })
  }
};

const resetUserInfo = () => {
  btnName.value = "编辑";
  isDisabled.value = true;
  userInfo.value = getLocalStorage('user');
};

const isCreator = ref(false);

const tabChange = (tabName) => {
  if (tabName === "third") {
    if (getLocalStorage('user').homeSerialNumber === null) {
      // ElMessage.error("您还没有加入家庭");
      return;
    }
    axios.getRequest("/home/isHomeCreator?homeSerialNumber=" + getLocalStorage('user').homeSerialNumber +
      "&userId=" + getLocalStorage('user').id).then(res => {
        isCreator.value = res.data;
      });
    getHomeMembers();
  }
  else if (tabName === "fourth") {
    getJoinNoticeData();
    if (getLocalStorage('user').homeSerialNumber != null) {
      return;
    }
    //没有家庭才能发起加入请求
    getVerifyNoticeData();
  }
};

const getHomeMembers = () => {
  axios.getRequest("/account/getHomeMembersByHSN/" + getLocalStorage("user").homeSerialNumber).then(res => {
    if (res.code === 200) {
      homeMembersTable.value = res.data;
    }
    else {
      ElMessage.error(res.message);
    }
  });
};

const deleteHomeMember = (row) => {
  axios.postRequest("/account/removeUserFromHome?requestId=" + getLocalStorage("user").id +
    "&removeId=" + row.id).then(res => {
      if (res.code === 200) {
        ElMessage.success("删除成功");
        getHomeMembers();
      }
      else {
        ElMessage.error(res.message);
      }
    });
};

const createHomeDialogVisible = ref(false);

const newHomeForm = ref({
  homeName: ""
});

const createHome = () => {
  if (userInfo.value.homeSerialNumber !== null) {
    ElMessage.error("您已经加入家庭！");
    return;
  }
  axios.postRequest("/home/createHome/" +
    getLocalStorage('user').id + '?homeName=' + newHomeForm.value.homeName)
    .then(res => {
      if (res.code === 200) {
        ElMessage.success("创建成功");
        createHomeDialogVisible.value = false;
        newHomeForm.value = {
          homeName: ""
        };
        userInfo.value.username = newHomeForm.value.homeName;
        userInfo.value.homeSerialNumber = res.data;
        setLocalStorage('user', userInfo.value);
      }
      else {
        ElMessage.error(res.message);
      }
    }).catch(err => {
      ElMessage.error(err.message);
    });
};

const joinHomeDialogVisible = ref(false);

const joinHomeForm = ref({
  homeSerialNumber: ""
});

const joinHome = () => {
  if (userInfo.value.homeSerialNumber !== null) {
    ElMessage.error("您已经加入家庭！");
    return;
  }
  axios.postRequest("/homeRequest/joinHome/" +
    getLocalStorage('user').id + '?homeSerialNumber=' + joinHomeForm.value.homeSerialNumber)
    .then(res => {
      if (res.code === 200) {
        ElMessage.success("请求发送成功！");
        joinHomeDialogVisible.value = false;
        joinHomeForm.value = {
          homeSerialNumber: ""
        };
      }
      else if (res.code === 1010) {
        ElMessage.error("该家庭不存在！");
      }
      else if (res.code === 1011) {
        ElMessage.error("您已经加入家庭或者已经发送过加入请求！");
      }
    }).catch((err) => {
      ElMessage.error(err.message);
    });
};

const agree = (row) => {
  axios.postRequest("/homeRequest/agreeJoinHome?requestId=" + row.recipientId +
    "&joinId=" + row.applicationId).then(res => {
      if (res.code === 200) {
        ElMessage.success("操作成功");
        getJoinNoticeData();
      }
      else {
        ElMessage.error(res.message);
      }
    });
};

const refuse = (row) => {
  axios.postRequest("/homeRequest/refuseJoinHome?requestId=" + row.recipientId +
    "&joinId=" + row.applicationId).then(res => {
      if (res.code === 200) {
        ElMessage.success("已拒绝");
        getJoinNoticeData();
      }
      else {
        ElMessage.error(res.message);
      }
    });
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
