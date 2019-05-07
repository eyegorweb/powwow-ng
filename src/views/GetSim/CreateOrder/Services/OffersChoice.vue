<template>
  <UiSelect
    class="form-offers mt-4"
    :class="selectedOffer_ ? '' : 'disabled'"
    v-model="selectedOffer_"
    :placeholder="$t('orders.select-offer-placeholder')"
    :options="formattedOffers"
    :arrow-blue="true"
  />
</template>

<script>
import UiSelect from '@/components/ui/UiSelect';
import { propWithSync } from '@/mixins';

export default {
  mixins: [propWithSync('selectedOffer')],

  props: {
    partnerId: {
      type: [Number, String],
    },
    offers: Array,
    isRcard: Boolean,
  },
  computed: {
    formattedOffers() {
      return this.offers.map(i => {
        return {
          code: i.code,
          id: i.id,
          initialOffer: i.initialOffer,
          label: i.rCard ? i.label : `${i.label}${this.$t('services.compatibility')}`,
          value: i.value,
          disabled: !i.rCard,
          workflowDescription: i.workflowDescription,
        };
      });
    },
  },
  components: {
    UiSelect,
  },
};
</script>

<style scoped></style>
