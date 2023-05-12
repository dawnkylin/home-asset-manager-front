<!-- eslint-disable max-len -->
<template>
  <div class="container">
    <el-form ref="formRef" :model="form" label-width="4em" class="form" :label-position="'top'" :rules="rules">
      <h1>家庭资产管理</h1>
      <el-form-item prop="phone">
        <el-input v-model="form.phone" placeholder="手机号" clearable :prefix-icon="Phone"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" clearable :prefix-icon="Lock"
          show-password></el-input>
      </el-form-item>
      <el-form-item>
        <button1 @click.prevent="onSubmit">登录</button1>
      </el-form-item>
      <!-- 去注册 -->
      <el-form-item>
        还没有账号？
        <el-link @click.prevent="router.push({ name: 'register' })">去注册</el-link>
      </el-form-item>
      <!-- 忘记密码 -->
      <el-form-item>
        <el-link @click.prevent="router.push({ name: 'forgetPwd' })">忘记密码</el-link>
      </el-form-item>
    </el-form>
    <GithubCornerMark />
  </div>
</template>
<script>
export default {
  name: "LoginPage",
};
</script>
<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import button1 from "@components/button1.vue";
import GithubCornerMark from "@components/github-corner-mark.vue";
import { Phone, Lock } from "@element-plus/icons-vue";
import axios from "@utils/request";
import { useAuthStore } from "@stores/auth";
import { ElMessage } from "element-plus";

const router = useRouter();

const authStore = useAuthStore();

// 表单数据
const form = reactive({
  phone: "",
  password: "",
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
  ],
});

// 提交表单
const onSubmit = () => {
  // 判断表单验证是否通过
  formRef.value.validate((valid) => {
    if (valid) {
      // 发送登录请求
      axios
        .postRequest("/auth/login", form)
        .then((res) => {
          // 登录成功
          if (res.code === 200) {
            authStore.login(res.data.token, res.data.user);
            //检查是否有重定向地址
            const redirect = router.currentRoute.value.query.redirect;
            if (redirect) {
              router.push({ path: redirect });
            } else {
              router.push({ path: "/" });
            }
            router.push({ path: "/" });
          }
          // 用户名或密码错误
          else if (res.code === 1006) {
            ElMessage.error("用户名或密码错误");
            // 重置表单数据
            // formRef.value.resetFields();
            // 重置表单验证
            formRef.value.validate();
          }
        })
        .catch((err) => {
          ElMessage.error("登录失败：" + err);
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
