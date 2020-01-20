<template>
  <AutoCompleteByPartnerContext
    :values="selectedTypeSimCardValues"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
    @update:values="values => $emit('setTypeSimCardFilter', values)"
  />
</template>

<script>
import AutoCompleteByPartnerContext from '@/components/AutoCompleteByPartnerContext';
import { fetchCardTypes } from '@/api/linesActions';

export default {
  components: {
    AutoCompleteByPartnerContext,
  },
  props: {
    selectedTypeSimCardValues: Array,
    selectedPartnersValues: Array,
    formatFn: {
      type: Function,
      required: false,
    },
  },
  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchCardTypes(q, partners, { page, limit, partnerType });
      if (data) {
        return data.map(c => {
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
