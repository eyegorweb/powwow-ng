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
import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  props: {
    offer: Object,
    selectedItems: Array,
    itemsToDisable: {
      type: Array,
      default: () => [],
    },
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
      const offerServices = getMarketingOfferServices(this.offer.initialOffer);
      const multiselectFormat = s => {
        return {
          ...s,
          id: s.code,
          label: this.$t('services.' + s.code),
        };
      };
      this.offerServices = offerServices.filter(s => s.code !== 'DATA').map(multiselectFormat);
      const disabledServices = this.offerServices.filter(s => !s.editable);
      this.disabledServices = [...disabledServices, ...this.itemsToDisable];
    },
  },

  watch: {
    offer() {
      this.initServices();
    },
    itemsToDisable() {
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
