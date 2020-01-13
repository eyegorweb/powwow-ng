<template>
  <BillingAccountsFilter
    :selected-billing-accounts-values="selectedBillingAccountsValues"
    :selected-partners-values="selectedPartnersValues"
    @update:values="setBillingAccountsFilter"
  />
</template>

<script>
import BillingAccountsFilter from '@/components/Filters/BillingAccountsFilter';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    BillingAccountsFilter,
  },

  computed: {
    ...mapGetters('alarms', ['selectedPartnersValues', 'selectedBillingAccountsValues']),
  },

  methods: {
    ...mapMutations('alarms', ['setBillingAccountsFilter']),
  },
};
</script>

<style scoped></style>
