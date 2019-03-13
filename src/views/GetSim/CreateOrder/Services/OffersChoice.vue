<template>
  <UiSelect
    class="form-offers mt-4"
    :class="selectedOffer_ ? '' : 'disabled'"
    v-model="selectedOffer_"
    :placeholder="$t('orders.select-offer-placeholder')"
    :options="offers"
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
  },
  components: {
    UiSelect,
  },
};
</script>

<style scoped></style>
