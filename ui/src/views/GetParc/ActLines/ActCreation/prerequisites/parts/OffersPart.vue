<template>
  <UiApiAutocomplete
    :api-method="fetchApi"
    v-model="selectedOffer"
    display-results-while-empty
    scroll-for-next
    :disabled="disabled"
    :error="error"
  />
</template>

<script>
import UiApiAutocomplete from '@/components/ui/UiApiAutocomplete';
import { fetchOffers } from '@/api/offers';
import { mapState } from 'vuex';

export default {
  components: {
    UiApiAutocomplete,
  },
  props: {
    partner: Object,
    offer: Object,
    disabled: Boolean,
    error: {
      type: String,
      required: false,
    },
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', ['actCreationPrerequisites']),
    prerequisiteOffer() {
      return this.actCreationPrerequisites && this.actCreationPrerequisites.offer
        ? this.actCreationPrerequisites.offer.data
        : '';
    },
    selectedOffer: {
      get() {
        return this.offer;
      },
      set(newValue) {
        this.$emit('update:offer', newValue);
      },
    },
  },

  methods: {
    async fetchApi(q, page = 0) {
      let partnerParam = this.partner ? [this.partner] : this.contextPartners;
      partnerParam = partnerParam.filter(p => p.label !== '');

      if (partnerParam && partnerParam.length) {
        const data = await fetchOffers(q, partnerParam, {
          page,
          limit: 10,
          partnerType: this.contextPartnersType,
        });
        if (data) {
          return data
            .filter(o => o.code !== this.prerequisiteOffer.code)
            .map(o => ({
              id: o.code,
              label: o.workflowDescription,
              data: o,
              productCode: o.initialOffer.code,
            }));
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
