<template>
  <UiSelect
    class="form-offers mt-4"
    :class="selectedOffer_ ? '' : 'disabled'"
    v-model="chosenOffer"
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
    chosenOffer: {
      get() {
        return this.selectedOffer ? this.selectedOffer_.code : undefined;
      },
      set(value) {
        this.$emit(
          'update:selectedOffer',
          this.offers.find(o => o.code === value)
        );
      },
    },
    formattedOffers() {
      return this.offers.map(i => {
        let workflowIsNotCompatible = false;
        if (this.isRcard) {
          workflowIsNotCompatible = !i.rCard;
        }

        return {
          code: i.code,
          id: i.id,
          initialOffer: i.initialOffer,
          label: !workflowIsNotCompatible
            ? i.initialOffer.description
            : `${i.initialOffer.description}${this.$t('services.compatibility')}`,
          value: i.value,
          disabled: workflowIsNotCompatible,
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
