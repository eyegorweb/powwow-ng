<template>
  <AutoCompleteByPartnerContext
    :values="selectedTypeSimCardValues"
    @update:values="(values) => (selectedTypeSimCardValues = values)"
    :selected-partners-values="selectedPartnersValues"
    :fetch-api="fetchApi"
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
    selectedData: Object,
  },
  mounted() {
    if (this.selectedData && this.selectedData.id) {
      this.selectedTypeSimCardValues = this.selectedData.values;
    }
  },
  watch: {
    selectedTypeSimCardValues(newValue) {
      this.$emit('change', newValue);
    },
    selectedData(selectedData) {
      if (!selectedData) {
        this.selectedTypeSimCardValues = [];
      }
    },
  },
  data() {
    return {
      selectedTypeSimCardValues: [],
      selectedPartnersValues: [],
    };
  },
  methods: {
    async fetchApi(q, partners, partnerType, { page, limit }) {
      const data = await fetchCardTypes(q, partners, { page, partnerType, limit });
      if (data) {
        return data.map(c => {
          return {
            id: c.simCard.code,
            label: c.simCard.description,
          };
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
