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
    ignoreCountries: {
      type: Array,
      default: []
    }
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
    this.countries = countries
      .filter(c => {
        const inIgnoredList = !!this.ignoreCountries.find(i => i === c.codeIso3);
        return !inIgnoredList;
      }).map(c => ({
        ...c,
        label: c.name,
        value: c.code,
      }));
  },
};
</script>

<style lang="scss" scoped></style>
