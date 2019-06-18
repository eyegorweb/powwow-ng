<template>
  <div class="circle-loader">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
$loader-size: 1.5em;

.circle-loader {
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-left-color: $secondary;
  animation: loader-spin 1.2s infinite linear;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: $loader-size;
  height: $loader-size;
  margin-top: $loader-size / 5;
  box-shadow: 0 0 0 rgba(204, 169, 44, 0.4);
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
