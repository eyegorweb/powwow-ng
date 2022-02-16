<template>
  <div class="flex">
    <MultiSelectServices
      :items="offerServices"
      :default-selected-items.sync="selectedServices"
      :selected-color="selectedColor"
      :disabled-items="itemsToDisable"
    />
  </div>
</template>

<script>
// import get from 'lodash.get';
import MultiSelectServices from './MultiSelectServices';
import { getMarketingOfferServices } from '@/components/Services/utils.js';

export default {
  props: {
    offer: Object,
    selectedItems: Array,
    selectedColor: {
      type: String,
      required: false,
    },
    itemsToDisable: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MultiSelectServices,
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
      const multiselectFormat = (s) => {
        return {
          ...s,
          id: s.code,
          label: s.labelService,
        };
      };
      const filteredOfferServices = offerServices
        .filter((s) => s.code !== 'DATA')
        .map(multiselectFormat);
      const disabledServices = filteredOfferServices.filter((s) => !s.editable);
      const allDisabledServices = [...disabledServices, ...this.itemsToDisable];

      this.offerServices = filteredOfferServices.filter(
        (s) => !allDisabledServices.find((d) => d.code === s.code)
      );
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

<style lang="scss" scoped>
.flex {
  display: flex;
}
</style>
