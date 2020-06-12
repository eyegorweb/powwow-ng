<template>
  <BillingAccountsFilter
    :selected-billing-accounts-values="selectedData || []"
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
    selectedData: Array,
    getPageContext: Function,
  },

  mounted() {
    console.log('Contexte >>', this.getPageContext());
  },
  computed: {
    partnerIds() {
      if (!this.getPageContext) return [];

      const pageContext = this.getPageContext();
      if (pageContext && pageContext.partnerId) {
        return [{ id: pageContext.partnerId }];
      }

      return [];
    },
  },
};
</script>

<style lang="scss" scoped></style>
