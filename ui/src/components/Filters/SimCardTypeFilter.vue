<template>
  <AutoCompleteByPartnerContext
    :values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    contains-search
    @update:values="values => $emit('setTypeSimCardFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchSimCards } from '@/api/linesActions';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },
  props: {
    selectedTypeSimCardValues: Array,
    selectedPartnersValues: Array,
    category: {
      type: String,
      required: false,
    },

    formatFn: {
      type: Function,
      required: false,
    },
  },

  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      const filters = {};
      const pagination = { limit, page };
      const sorting = {
        description: 'DESC',
      };
      if (partners && partners.length) {
        filters.partners = {
          in: partners.map(p => p.id),
        };
      }
      if (partnerType) {
        filters.partyType = {
          in: [partnerType],
        };
      }
      if (q) {
        filters.description = {
          contains: q,
        };
      }
      if (this.category) {
        filters.category = { eq: this.category };
      }
      const data = await fetchSimCards(filters, pagination, sorting);

      if (data) {
        return data.map(c => {
          if (this.formatFn) {
            return this.formatFn(c);
          } else {
            return {
              id: c.simCard.code,
              label: c.simCard.description,
              data: c,
            };
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
