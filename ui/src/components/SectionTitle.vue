<template>
  <h5 class="text-primary text-uppercase mb-4">
    <span class="badge badge-pill badge-primary">{{ num }}</span>
    <span class="title"> <slot /></span>
  </h5>
</template>

<script>
export default {
  props: {
    num: Number,
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-weight: 700;

  .title {
    position: relative;
    top: 3px;
    padding-left: 5px;
  }
}
</style>
