<template>
  <CountriesPart v-model="country" />
</template>

<script>
import CountriesPart from './LocalisationFilter/CountriesPart';

export default {
  components: {
    CountriesPart,
  },
  props: {
    selectedData: Object,
  },

  computed: {
    country: {
      get() {
        if (!this.selectedData) return;
        return this.selectedData.data;
      },
      set(country) {
        this.$emit('change', country);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
