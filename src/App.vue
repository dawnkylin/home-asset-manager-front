<template>
  <!-- 过渡效果 -->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>
<script>
export default {
  name: "app",
};
</script>
