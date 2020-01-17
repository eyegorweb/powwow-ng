<template>
  <BillingAccountsFilter
    :selected-billing-accounts-values="selectedData || []"
    :selected-partners-values="[]"
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
  },
};
</script>

<style lang="scss" scoped></style>
