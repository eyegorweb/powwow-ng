<template>
  <AutoCompleteByPartnerContext
    :values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    contains-search
    @update:values="(values) => $emit('setTypeSimCardFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchSimCards } from '@/api/linesActions';
import { mapGetters } from 'vuex';

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
    excludeCategory: {
      type: String,
      required: false,
    },

    formatFn: {
      type: Function,
      required: false,
    },
  },

  computed: {
    ...mapGetters('actLines', ['currentFilters']),
  },

  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      let filters = {};
      const pagination = { limit, page };
      const sorting = {
        description: 'DESC',
      };
      if (partners && partners.length) {
        filters.partyId = {
          in: partners.map((p) => p.id),
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
      if (this.excludeCategory) {
        filters.category = { ne: this.excludeCategory };
      }

      if (this.currentFilters && this.currentFilters.length && !this.category) {
        const categoryFilter = this.currentFilters.filter(
          (f) => ['indicators.getparc.lines.esim.category'].indexOf(f.id) > -1
        ).length;
        if (categoryFilter) {
          filters.category = { eq: this.currentFilters[0].meta.value };
        }
      }
      const data = await fetchSimCards(filters, pagination, sorting);

      if (data) {
        return data.map((c) => {
          if (this.formatFn) {
            return this.formatFn(c);
          } else {
            return {
              id: c.simCard.code,
              label: c.simCard.description,
            };
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
