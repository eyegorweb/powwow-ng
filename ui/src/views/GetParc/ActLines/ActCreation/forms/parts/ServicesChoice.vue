<template>
  <MultiSelectSearch
    :items="offerServices"
    :disabled-items="disabledServices"
    :default-selected-items.sync="selectedServices"
  />
</template>

<script>
// import get from 'lodash.get';
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { getOfferServices } from '@/components/Services/utils.js';

export default {
  props: {
    offer: Object,
    selectedItems: Array,
  },
  components: {
    MultiSelectSearch,
  },

  mounted() {
    this.initServices();
  },

  data() {
    return {
      disabledServices: [],
      offerServices: [],
    };
  },

  methods: {
    initServices() {
      const offerServices = getOfferServices(this.offer.initialOffer);
      const multiselectFormat = s => {
        return {
          ...s,
          id: s.code,
          label: this.$t('services.' + s.code),
        };
      };
      this.offerServices = offerServices.filter(s => s.code !== 'DATA').map(multiselectFormat);
      this.disabledServices = this.offerServices.filter(s => !s.editable);
    },
  },

  watch: {
    offer() {
      this.initServices();
    },
  },

  computed: {
    selectedServices: {
      get() {
        return this.selectedItems;
      },
      set(newValues) {
        this.$emit('update:selectedItems', newValues);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
