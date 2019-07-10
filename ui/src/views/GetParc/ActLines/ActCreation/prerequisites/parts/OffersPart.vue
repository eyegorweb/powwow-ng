<template>
  <div>
    <UiApiAutocomplete
      :api-method="fetchApi"
      v-model="selectedOffer"
      display-results-while-empty
      scroll-for-next
    />
  </div>
</template>

<script>
// import OffersPart from '@/views/GetParc/ActLines/ActCreation/prerequisites/parts/OffersPart
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
  },

  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
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
      const partnerParam = this.partner ? [this.partner] : this.contextPartners;
      const data = await fetchOffers(q, partnerParam, {
        page,
        limit: 10,
        partnerTypes: this.contextPartnersTypes,
      });
      if (data) {
        return data.map(o => ({
          id: o.code,
          label: o.workflowDescription,
          data: o,
        }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
