<template>
  <div>
    <h2 class="title">{{ $t("getsim.manage-orders") }}</h2>
    <GetSimTypeOption v-for="item in test"/>
  </div>
</template>

<script>
import GetSimTypeOption from '@/components/GetSimTypeOption';

export default {
  name: 'GetSimSelectSimType',
  data() {
    return {
      test: 2,
    };
  },
  components: {
    GetSimTypeOption,
  },
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
