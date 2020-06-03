<template>
  <div>
    <UiApiAutocomplete
      v-if="countries"
      :items="countries"
      v-model="country"
      display-results-while-empty
    />
  </div>
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchDeliveryCountries } from '@/api/filters';

export default {
  components: {
    UiApiAutocomplete,
  },

  props: {
    value: Object,
  },

  computed: {
    country: {
      get() {
        if (!this.value) return undefined;

        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },

  data() {
    return {
      countries: undefined,
    };
  },

  async mounted() {
    const countries = await fetchDeliveryCountries(this.$i18n.locale);
    this.countries = countries.map(c => ({
      ...c,
      label: c.name,
      value: c.code,
    }));
  },
};
</script>

<style lang="scss" scoped></style>
