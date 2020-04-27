<template>
  <UiApiAutocomplete :items="countries" v-model="selectedItem" display-results-while-empty />
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
  data() {
    return {
      countries: [],
    };
  },
  computed: {
    selectedItem: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
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
