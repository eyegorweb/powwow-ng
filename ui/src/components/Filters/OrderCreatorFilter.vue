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

    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchUsers(q, partners, { page, limit, partnerType });
      if (data) {
        return data.map(p => {
          const formattedUser = {
            id: p.id,
            label: `${p.name.firstName || ''} ${p.name.lastName || ''}`,
          };
          if (p.party) {
            formattedUser.partnerId = p.party.id;
          }
          return formattedUser;
        });
      }
    },
  },
};
</script>

<style scoped></style>
