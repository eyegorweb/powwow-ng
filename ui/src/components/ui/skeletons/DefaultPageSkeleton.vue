<template>
  <div class="loader">
    <div class="spinner spinner-l spinner-dark"></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
// body {
//   background-color: #f3f3f3;
// }
.loader {
  color: #3c4859;
  background: #f3f3f3;
  z-index: 100;
}
.spinner {
  color: #3c4859;
  padding: 0;
  border: 0;
  display: inline-block;
  border-radius: 50%;
  animation: spin 0.5s linear infinite;
  box-sizing: border-box;
  border-style: solid;
  border-color: #1f2d3d transparent transparent;
  width: 50px;
  height: 50px;
  border-width: 3px;
  position: absolute;
  z-index: 20;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>
