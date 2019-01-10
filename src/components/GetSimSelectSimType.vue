<template>
  <div>
    <h2 class="title">{{ $t("getsim.manage-orders") }}</h2>
  </div>
</template>

<script>
export default {
  name: 'GetSimSelectSimType',
};
</script>

<style scoped>
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 50px 0 30px;
  padding: 0;
  text-align: center;
}
</style>
