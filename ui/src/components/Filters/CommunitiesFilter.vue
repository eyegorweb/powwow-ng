<template>
  <AutoCompleteByPartnerContext
    :values="selectedCommunityValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="(values) => $emit('update:values', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchYorkCommunity } from '@/api/offers';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedCommunityValues: Array,
    selectedPartnersValues: Array,
  },

  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchYorkCommunity(q, { page, limit, partnerType }, partners);
      if (data) {
        return data.map((d) => ({
          id: d.code,
          label: `${d.code}`,
        }));
      }
    },
  },
};
</script>

<style scoped></style>
