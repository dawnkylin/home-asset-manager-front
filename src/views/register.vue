<template>
  <div class="container">
    <el-form ref="formRef" :model="form" label-width="4em" class="form" :label-position="'top'" :rules="rules">
      <h1>家庭资产管理</h1>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="手机号" clearable :prefix-icon="Phone" maxlength="11"
          show-word-limit></el-input>
      </el-form-item>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" clearable :prefix-icon="Lock"
          show-password></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code">
        <el-row>
          <el-col :span="15">
            <el-input v-model="form.code" placeholder="验证码" clearable :prefix-icon="Lock" maxlength="6"
              show-word-limit></el-input>
          </el-col>
          <el-col :span="9">
            <!-- 60s倒计时 -->
            <el-button type="info" :disabled="isDisabled" @click="sendSms">{{ btnText }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <button1 @click="onSubmit">注册</button1>
      </el-form-item>
      <!-- 去注册 -->
      <el-form-item>
        已有账号？
        <el-link @click="router.push({ name: 'login' })">去登录</el-link>
      </el-form-item>
    </el-form>
    <GithubCornerMark />
  </div>
</template>
<script>
export default {
  name: "RegisterPage",
};
</script>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import button1 from "@components/button1.vue";
import GithubCornerMark from "@components/github-corner-mark.vue";
import { isStrongPassword } from "@utils/regex";
import { Phone, Lock } from "@element-plus/icons-vue";
import axios from "@utils/request";
import { ElMessage } from "element-plus";

const router = useRouter();

const isDisabled = ref(false);
const btnText = ref("获取验证码");

// 表单数据
const form = reactive({
  phone: "",
  password: "",
  code: "",
  username: "",
});

// 表单引用
const formRef = ref(null);

// 表单验证规则
const rules = reactive({
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (!isStrongPassword(value)) {
          callback(new Error("密码长度不能小于6位，且必须包含数字和字母"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  code: [
    { required: true, message: "请输入验证码", trigger: "blur" },
    { pattern: /^\d{6}$/, message: "请输入正确的验证码", trigger: "blur" },
  ],
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/, message: "2-10位，包括汉字、字母、数字和下划线", trigger: "blur" },
  ],
});

// 发送验证码
const sendSms = () => {
  // 判断表单验证是否通过
  formRef.value.validateField("phone", (valid) => {
    if (valid) {
      // 发送验证码请求
      isDisabled.value = true;
      axios
        .postRequest("/auth/sendSms?phone="+ form.phone)
        .then((res) => {
          // 发送成功
          if (res.code === 200) {
            ElMessage.success(res.message);
            // 60s倒计时
            let count = 60;
            const timer = setInterval(() => {
              if (count > 0 && count <= 60) {
                count--;
                btnText.value = count + "s";
              } else {
                clearInterval(timer);
                btnText.value = "获取验证码";
                isDisabled.value = false;
              }
            }, 1000);
          }
          // 手机号不存在
          else if (res.code === 1007) {
            ElMessage.error("手机号不存在");
            isDisabled.value = false;
          }
          else {
            ElMessage.error("验证码发送失败");
            isDisabled.value = false;
          }
        })
        .catch((err) => {
          ElMessage.error("验证码发送失败：" + err);
          isDisabled.value = false;
        });
    } else {
      ElMessage.error("请检查表单数据");
    }
  });
}

// 提交表单
const onSubmit = () => {
  // 判断表单验证是否通过
  formRef.value.validate((valid) => {
    if (valid) {
      // 发送注册请求
      axios
        .postRequest("/auth/register?code="+form.code, form)
        .then((res) => {
          // 注册成功
          if (res.code === 200) {
            ElMessage.success("注册成功");
            // 1s后跳转到登录页面
            // setTimeout(() => {
            //   router.push({ name: "login" });
            // }, 3000);
          }
          else if (res.code === 1001) {
            ElMessage.error("手机号已存在");
          }
          else if (res.code === 1004) {
            ElMessage.error("验证码已过期");
          }
          else if (res.code === 1005) {
            ElMessage.error("验证码错误");
          }
        })
        .catch((err) => {
          ElMessage.error("注册失败：" + err);
        });
    } else {
      ElMessage.error("请检查表单数据");
    }
  });
};
</script>
<style scoped lang="scss">
@use "@assets/styles/login-register.scss";
</style>
