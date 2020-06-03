<template>
  <div>
    <OfferCombo :value.sync="selectedOffer" :partners="partnersForFilters" />
  </div>
</template>

<script>
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';

export default {
  components: {
    OfferCombo,
  },

  props: {
    selectedData: Object,
    selectedFilters: Array,
  },

  computed: {
    selectedOffer: {
      get() {
        if (!this.selectedData) return;

        return this.selectedData.data;
      },
      set(value) {
        this.$emit('change', value);
      },
    },
    partnersForFilters() {
      if (!this.selectedFilters || !this.selectedFilters.length) return [];

      const ret = this.selectedFilters.find(f => f.id === 'getadmin.users.filters.partners');

      if (ret) {
        return [ret.data];
      }

      return [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
