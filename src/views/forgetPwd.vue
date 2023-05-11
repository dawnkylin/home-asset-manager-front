<template>
  <!-- 步骤条：第一步验证手机号是否注册，第二步发送验证码，第三步修改密码 -->
  <div class="container">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="验证手机号" description="验证手机号是否注册"></el-step>
      <el-step title="发送验证码" description="发送验证码到手机"></el-step>
      <el-step title="修改密码" description="修改密码"></el-step>
    </el-steps>
    <!-- 步骤条内容 -->
    <div class="content">
      <!-- 第一步 -->
      <div v-show="active === 0">
        <el-form ref="formRef" :model="form" label-width="4em" class="form" :label-position="'top'" :rules="rules">
          <el-form-item prop="phone">
            <el-input v-model="form.phone" placeholder="手机号" clearable :prefix-icon="Phone"></el-input>
          </el-form-item>
          <el-form-item>
            <button1 @click.prevent="onSubmit">发送验证码</button1>
          </el-form-item>
        </el-form>
      </div>
      <!-- 第二步 -->
      <div v-show="active === 1">
        <el-form ref="formRef" :model="form" label-width="4em" class="form" :label-position="'top'" :rules="rules">
          <el-form-item prop="code">
            <el-input v-model="form.code" placeholder="验证码" clearable :prefix-icon="Code"></el-input>
          </el-form-item>
          <el-form-item>
            <button1 @click.prevent="onSubmit">下一步</button1>
          </el-form-item>
        </el-form>
      </div>
      <!-- 第三步 -->
      <div v-show="active === 2">
        <el-form ref="formRef" :model="form" label-width="4em" class="form" :label-position="'top'" :rules="rules">
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" clearable :prefix-icon="Lock"
              show-password></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="确认密码" clearable :prefix-icon="Lock"
              v-show="active === 2" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <button1 @click.prevent="onSubmit">下一步</button1>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <GithubCornerMark />
  </div>
</template>
<script>
export default {
  name: "ForgetPwdPage",
};
</script>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import button1 from "@components/button1.vue";
import GithubCornerMark from "@components/github-corner-mark.vue";
import { isStrongPassword } from "@utils/regex";
import { Phone, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import axios from "@utils/request";
import { isPhone } from "@utils/regex";

const router = useRouter();
const active = ref(0);
const form = reactive({
  phone: "",
  code: "",
  password: "",
  confirmPassword: "",
});
//提交表单
const onSubmit = () => {
  if (active.value === 0) {
    //验证手机号是否正确
    if (!isPhone(form.phone)) {
      ElMessage.error("手机号格式不正确");
      return;
    }
    //验证手机号是否注册
    axios
      .getRequest("/auth/isExist", {
        params: {
          phone: form.phone,
        },
      })
      .then((res) => {
        if (res.code === 1001) {
          //发送验证码到手机
          axios
            .postRequest("/auth/sendSms?phone=" + form.phone)
            .then((res) => {
              if (res.code === 200) {
                active.value = 2;
                ElMessage.success("发送成功");
                active.value = 1;
              } else {
                ElMessage.error(res.message);
              }
            });
        } else {
          ElMessage.error(res.message);
        }
      });
  } else if (active.value === 1) {
    //验证验证码是否正确
    axios
      .getRequest("/auth/checkSms?phone=" + form.phone + "&code=" + form.code)
      .then((res) => {
        if (res.code === 200) {
          active.value = 2;
        } else {
          ElMessage.error(res.message);
        }
      });
  } else if (active.value === 2) {
    //修改密码
    if (form.password !== form.confirmPassword) {
      ElMessage.error("两次密码不一致");
      return;
    }
    if (!isStrongPassword(form.password)) {
      ElMessage.error("密码必须包含大小写字母和数字的组合，不能使用特殊字符，长度在6-10之间");
      return;
    }
    axios
      .postRequest("/auth/forgetPassword?phone=" + form.phone + "&password=" + form.password)
      .then((res) => {
        if (res.code === 200) {
          ElMessage.success("修改成功");
          router.push("/login");
        } else {
          ElMessage.error(res.message);
        }
      });
  }
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .form {
      width: 100%;
      max-width: 400px;
      margin-top: 2rem;
    }
  }
}
</style>
