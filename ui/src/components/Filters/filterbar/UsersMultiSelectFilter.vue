<template>
  <AutoCompleteByPartnerContext
    :values="selectedOrderCreatorValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="(values) => $emit('change', values)"
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
    selectedData: Object,
    getPageContext: Function,
  },

  computed: {
    selectedPartnersValues() {
      if (!this.getPageContext) return [];
      const pageContext = this.getPageContext();
      if (pageContext && pageContext.partners) {
        return pageContext.partners;
      }

      return [];
    },
    selectedOrderCreatorValues() {
      if (!this.selectedData) {
        return [];
      }
      return this.selectedData.values;
    },
  },

  methods: {
    async fetchApi(q, forPartners, contextPartnersType, pagination) {
      const orderBy = { key: 'fullname', direction: 'ASC' };
      const data = await searchUsers(q, orderBy, pagination, []);
      if (data) {
        return data.items.map((p) => {
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
