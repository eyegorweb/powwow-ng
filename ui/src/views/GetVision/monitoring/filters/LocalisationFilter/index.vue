<template>
  <div>
    <ZonePart v-model="zone" />

    <CountriesPart v-if="zone.world" v-model="country" />

    <UiInput v-if="zone.france" v-model="zipCode" placeholder="Code postale" />
  </div>
</template>

<script>
import ZonePart from './ZonePart';
import CountriesPart from './CountriesPart';
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    ZonePart,
    CountriesPart,
    UiInput,
  },
  props: {
    selectedData: Object,
  },
  computed: {
    zone: {
      get() {
        if (!this.selectedData) return { world: true, france: false };
        return this.selectedData.data.zone;
      },
      set(zone) {
        this.$emit('change', {
          zone,
          country: zone.world ? this.country : undefined,
          zipCode: zone.france ? this.zipCode : undefined,
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
          zone: this.zone,
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
          zone: this.zone,
          country: this.country,
          zipCode,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
