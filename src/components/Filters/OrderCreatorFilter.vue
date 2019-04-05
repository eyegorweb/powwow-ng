<template>
  <AutoCompleteByPartnerContext
    :values="selectedOrderCreatorValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="setOrderCreatorFilter"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchUsers } from '@/api/users';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedOrderCreatorValues: Array,
    selectedPartnersValues: Array,
  },

  methods: {
    setOrderCreatorFilter(creators) {
      this.$emit('setOrderCreatorFilter', creators);
    },

    async fetchApi(q, partners, partnerTypes, { page, limit }) {
      const data = await fetchUsers(q, partners, { page, limit, partnerTypes });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: `${p.name.firstName || ''} ${p.name.lastName || ''}`,
          partnerId: p.party.id,
        }));
      }
    },
  },
};
</script>

<style scoped></style>
