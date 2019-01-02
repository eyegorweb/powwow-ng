<template>
  <MultiSelectSearch
    :items="billingAccounts"
    :default-selected-items.sync="selectedBillingAccounts"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapMutations, mapGetters } from 'vuex';

import { fetchBillingAccounts } from '@/api/billingAccounts';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      billingAccounts: [],
      seectedBiilingAccounts: [],
    };
  },
  async mounted() {
    this.billingAccounts = await fetchBillingAccounts('', this.selectedPartnersValues, {
      page: 1,
      limit: 50,
    });
  },
  methods: {
    ...mapMutations(['setBillingAccountsFilter']),

    async searchValueChanged(q) {
      this.billingAccounts = await fetchBillingAccounts(q, this.selectedPartnersValues, {
        page: 1,
        limit: 50,
      });
      this.lastSearchTerm = q;
      this.page = 1;
    },
    async nextPage() {
      this.page += 1;
      const res = await fetchBillingAccounts(this.lastSearchTerm, this.selectedPartnersValues, {
        page: this.page,
        limit: 50,
      });
      if (res) {
        this.billingAccounts = this.billingAccounts.concat(res);
      }
    },
  },
  computed: {
    ...mapGetters(['selectedPartnersValues', 'selectedBillingAccountsValues']),

    selectedBillingAccounts: {
      get() {
        return this.selectedBillingAccountsValues;
      },
      set(billingAccounts) {
        this.setBillingAccountsFilter(billingAccounts);
      },
    },
  },
};
</script>

<style scoped>
</style>
