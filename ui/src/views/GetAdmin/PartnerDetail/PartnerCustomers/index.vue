<template>
  <div>
    <router-view :partner="partner"></router-view>
  </div>
</template>

<script>
export default {
  props: {
    partner: Object,
  },
};
</script>

<style lang="scss" scoped></style>
