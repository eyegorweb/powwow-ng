<template>
  <OfferCombo
    v-model="selectedOffer"
    :partners="partnersForFilters"
    :disabled="!partner || !!partnerGroup"
  />
</template>

<script>
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    OfferCombo,
  },

  props: {
    selectedData: Object,
    selectedFilters: Array,
  },

  computed: {
    ...mapGetters(['userIsPartner']),
    partnerGroup() {
      const partnerGroup = this.selectedFilters.find(
        (f) => f.id === 'getadmin.users.filters.partnerGroup'
      );

      return partnerGroup && partnerGroup.data.value;
    },
    partner() {
      if (this.userIsPartner) {
        return true;
      }
      return this.selectedFilters.find((f) => f.id === 'getadmin.users.filters.partners');
    },
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

      const ret = this.selectedFilters.find((f) => f.id === 'getadmin.users.filters.partners');

      if (ret) {
        return [ret.data];
      }

      return [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
