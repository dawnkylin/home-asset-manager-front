<template>
  <div class="error-page">
    <div class="error-page__content">
      <div class="error-page__content__title">404</div>
      <div class="error-page__content__desc">抱歉，你访问的页面不存在</div>
      <div class="error-page__content__button">
        <el-button type="primary" @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "404Page",
};
</script>
<script setup>
const goBack = () => {
  window.history.length > 2 ? window.history.go(-2) : window.location.replace("/");
};
</script>
<style lang="scss" scoped>
.error-page {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .error-page__content {
    text-align: center;
    .error-page__content__title {
      font-size: 100px;
      font-weight: 700;
      color: #333;
    }
    .error-page__content__desc {
      font-size: 24px;
      color: #666;
    }
    .error-page__content__button {
      margin-top: 20px;
    }
  }
}
</style>
