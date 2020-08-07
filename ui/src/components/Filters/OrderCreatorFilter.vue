<template>
  <AutoCompleteByPartnerContext
    :values="selectedOrderCreatorValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="values => $emit('setOrderCreatorFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { searchUsers } from '@/api/users';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },

  props: {
    selectedOrderCreatorValues: Array,
    selectedPartnersValues: Array,
  },

  methods: {
    async fetchApi(q, forPartners, contextPartnersType, pagination) {
      const orderBy = { key: 'id', direction: 'ASC' };
      const data = await searchUsers(q, orderBy, pagination, []);
      if (data) {
        return data.items.map(p => {
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
