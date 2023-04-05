<!-- eslint-disable max-len -->
<template>
  <button class="button">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: "Button1Component",
};
</script>
<style scoped lang="scss">
$bg-img: linear-gradient(to bottom right, #00c6ff, #0072ff);
.button {
  display: inline-block;
  padding: .7rem 2rem;
  margin: 0 auto;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  background-image: $bg-img;
  border: none;
  border-radius: 2rem;
  box-shadow: 0px 4px 0px #0072ff;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    $bg-img: linear-gradient(to bottom right, #0072ff, #00c6ff);
    background-image: $bg-img;
    box-shadow: 0px 6px 0px #0072ff;
  }
  &:active {
    transform: translateY(0px);
    box-shadow: none;
    background-image: linear-gradient(to bottom right, #0072ff, #00c6ff);
  }
}
</style>
