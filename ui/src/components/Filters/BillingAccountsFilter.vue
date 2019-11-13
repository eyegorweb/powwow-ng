<template>
  <AutoCompleteByPartnerContext
    :values="selectedBillingAccountsValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="setBillingAccountsFilter"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchBillingAccounts } from '@/api/billingAccounts';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedBillingAccountsValues: Array,
    selectedPartnersValues: Array,
  },

  methods: {
    setBillingAccountsFilter(values) {
      this.$emit('update:values', values);
    },

    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchBillingAccounts(q, partners, { page, limit, partnerType });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: `${p.code} - ${p.name}`,
          partnerId: p.party.id,
        }));
      }
    },
  },
};
</script>

<style scoped></style>
