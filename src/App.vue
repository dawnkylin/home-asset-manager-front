<template>
  <router-view />
</template>
<script>
export default {
  name: "app",
};
</script>
<script setup>
/**
 * 给左右方向键绑定前进后退事件
 */
const handleKeydown = (e) => {
  if (e.keyCode === 37) {
    window.history.back();
  } else if (e.keyCode === 39) {
    window.history.forward();
  }
};
// 监听键盘事件
window.addEventListener("keydown", handleKeydown);
</script>
