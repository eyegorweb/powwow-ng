<template>
  <div>
    <div class="mb-3">
      <h6>{{ $t('filters.zone') }}</h6>
      <UiSelect class="text-gray" block v-model="zone" :options="zones" />
    </div>

    <template v-if="zone == 'world'">
      <h6>{{ $t('filters.country') }}</h6>
      <CountriesPart v-if="zone == 'world'" :ignore-countries="['FRA']" v-model="country" />
    </template>
    <template v-if="zone == 'france'">
      <h6>{{ $t('filters.postalCode') }}</h6>
      <UiInput v-model="zipCode" :placeholder="$t('filters.postalCode')" block />
    </template>
  </div>
</template>

<script>
import CountriesPart from './CountriesPart';
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    CountriesPart,
    UiInput,
    UiSelect,
  },
  props: {
    selectedData: Object,
  },
  data() {
    return {
      zones: [
        { label: this.$t('map.world'), value: 'world' },
        { label: this.$t('map.countryFR'), value: 'france' },
      ],
    };
  },
  computed: {
    zone: {
      get() {
        if (!this.selectedData) return;
        return this.selectedData.data.zone.value;
      },
      set(value) {
        this.$emit('change', {
          zone: this.zones.find((z) => z.value === value),
          country: value === 'world' ? this.country : undefined,
          zipCode: value === 'france' ? this.zipCode : undefined,
        });
      },
    },

    country: {
      get() {
        if (!this.selectedData) return;
        return this.selectedData.data.country;
      },
      set(country) {
        this.$emit('change', {
          zone: this.zones.find((z) => z.value === this.zone),
          country,
          zipCode: this.zipCode,
        });
      },
    },

    zipCode: {
      get() {
        if (!this.selectedData) return;
        return this.selectedData.data.zipCode;
      },
      set(zipCode) {
        this.$emit('change', {
          zone: this.zones.find((z) => z.value === this.zone),
          country: this.country,
          zipCode,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
