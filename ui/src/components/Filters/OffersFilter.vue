<template>
  <AutoCompleteByPartnerContext
    :values="selectedOffersValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="values => $emit('setOffersFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchOffers } from '@/api/offers';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedOffersValues: Array,
    selectedPartnersValues: Array,
  },

  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchOffers(q, partners, { page, limit, partnerType });
      if (data) {
        return data.map(o => ({
          id: o.code,
          label: o.workflowDescription,
        }));
      }
    },
  },
};
</script>

<style scoped></style>
