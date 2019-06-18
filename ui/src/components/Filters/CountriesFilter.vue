<template>
  <MultiSelectSearch
    :items="countriesSelectItems"
    :default-selected-items.sync="selectedCountries"
  />
</template>

<script>
/**
 * To refactor, need to deal with translations here
 */
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';

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

  props: {
    values: Array,
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
      // this.updateSelectedDeliveryCountriesLabels(this.countries);
      this.$emit('updateLabels', this.countries);
    },
  },

  methods: {
    // ...mapMutations('getsim', ['updateSelectedDeliveryCountriesLabels']),
  },

  computed: {
    // ...mapGetters({ storeSelectedCountries: 'getsim/selectedDeliveryCountries' }),

    countriesSelectItems: ({ countries }) =>
      countries.map(country => ({
        id: country.code,
        label: country.name,
        codeIso3: country.codeIso3,
      })),

    selectedCountries: {
      get() {
        return this.values;
      },
      set(countries) {
        this.$emit('updatePartners', countries);
      },
    },
  },
};
</script>

<style scoped></style>
