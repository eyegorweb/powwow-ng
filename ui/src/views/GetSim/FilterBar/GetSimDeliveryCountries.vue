<template>
  <CountriesFilter
    :values="storeSelectedCountries"
    @updatePartners="setDeliveryCountriesFilter"
    @updateLabels="updateSelectedDeliveryCountriesLabels"
  />
</template>

<script>
import CountriesFilter from '@/components/Filters/CountriesFilter';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    CountriesFilter,
  },

  data() {
    return {
      countries: [],
    };
  },

  methods: {
    ...mapMutations('getsim', [
      'setDeliveryCountriesFilter',
      'updateSelectedDeliveryCountriesLabels',
    ]),
  },

  computed: {
    ...mapGetters({ storeSelectedCountries: 'getsim/selectedDeliveryCountries' }),
  },
};
</script>

<style scoped></style>
