<template>
  <MultiSelectSearch
    :items="countriesSelectItems"
    :default-selected-items.sync="selectedCountries"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapMutations, mapGetters } from 'vuex';

import { fetchDeliveryCountries } from '@/api/filters';

export default {
  components: {
    MultiSelectSearch,
  },

  data() {
    return {
      countries: [],
    };
  },

  async created() {
    this.countries = await fetchDeliveryCountries(this.$i18n.locale);
  },

  watch: {
    async '$i18n.locale'(locale) {
      this.countries = await fetchDeliveryCountries(locale);
      // because countries names are retrieved from API
      // instead of being stored in locales/en.json, we have to directly
      // adapt them in the store
      this.updateSelectedDeliveryCountriesLabels(this.countries);
    },
  },

  methods: {
    ...mapMutations('getsim', [
      'setDeliveryCountriesFilter',
      'updateSelectedDeliveryCountriesLabels',
    ]),
  },

  computed: {
    ...mapGetters({ storeSelectedCountries: 'getsim/selectedDeliveryCountries' }),

    countriesSelectItems: ({ countries }) =>
      countries.map(country => ({ id: country.code, label: country.name })),

    selectedCountries: {
      get() {
        return this.storeSelectedCountries;
      },
      set(countries) {
        this.setDeliveryCountriesFilter(countries);
      },
    },
  },
};
</script>

<style scoped></style>
