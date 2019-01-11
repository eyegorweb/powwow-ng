<template>
  <div>
    <h2 class="title">{{ $t("getsim.manage-orders") }}</h2>
    <div class="choose-sim-type">
      <GetSimTypeOption v-for="item in test"/>
      <div class="text-right">
        <a href="#" class="show-all-types text-right">
          {{ $t("getsim.show-all-sim-types") }}
          <i data-v-0d262568 class="arrow ic-Arrow-Down-Icon"></i>
        </a>
      </div>
      <p>encore du texte</p>
    </div>
  </div>
</template>

<script>
import GetSimTypeOption from '@/components/GetSimTypeOption';

export default {
  name: 'GetSimSelectSimType',
  data() {
    return {
      test: 3,
    };
  },
  components: {
    GetSimTypeOption,
  },
};
</script>

<style lang="scss" scoped>
.title {
  background-color: transparent;
  color: $dark-gray;
  font-weight: 300;
  font-size: 2rem;
  margin: 50px 0 30px;
  padding: 0;
  text-align: center;
}
.show-all-types {
  color: $secondary;
  font-weight: 600;
  font-size: 0.9rem;
  appearance: none;
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;

  &:hover {
    text-decoration: none;
  }

  i {
    font-size: 1rem;
  }
}
</style>
