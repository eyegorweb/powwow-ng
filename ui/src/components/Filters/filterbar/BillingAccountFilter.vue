<template>
  <BillingAccountsFilter
    :selected-billing-accounts-values="selectedValues"
    :selected-partners-values="partnerIds"
    @update:values="$emit('change', $event)"
  />
</template>

<script>
import BillingAccountsFilter from '@/components/Filters/BillingAccountsFilter';

export default {
  components: {
    BillingAccountsFilter,
  },
  props: {
    selectedData: Object,
    getPageContext: Function,
  },

  computed: {
    selectedValues() {
      if (this.selectedData) {
        return this.selectedData.values;
      }
      return [];
    },
    partnerIds() {
      if (!this.getPageContext) return [];
      const pageContext = this.getPageContext();
      if (pageContext && pageContext.partners) {
        return pageContext.partners;
      }

      return [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
