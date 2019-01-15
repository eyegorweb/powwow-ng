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
      lastSearchTerm: '',
      page: 0,
    };
  },
  async mounted() {
    this.billingAccounts = await this.fetchFormattedBillingAccountForDatatable('', {
      page: 0,
      limit: 10,
    });
  },
  methods: {
    ...mapMutations(['setBillingAccountsFilter']),

    async fetchFormattedBillingAccountForDatatable(q, { page, limit }) {
      const data = await fetchBillingAccounts(q, this.selectedPartnersValues, { page, limit });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: p.name,
          partnerId: p.party.id,
        }));
      }
      return undefined;
    },

    async searchValueChanged(q) {
      this.billingAccounts = await this.fetchFormattedBillingAccountForDatatable(q, {
        page: 0,
        limit: 50,
      });
      this.lastSearchTerm = q;
      this.page = 0;
    },
    async nextPage() {
      this.page += 1;
      const res = await this.fetchFormattedBillingAccountForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 50,
      });
      if (res) {
        this.billingAccounts = this.billingAccounts.concat(res);
      }
    },
  },

  watch: {
    async selectedPartnersValues() {
      this.billingAccounts = await this.fetchFormattedBillingAccountForDatatable(
        this.lastSearchTerm,
        {
          page: this.page,
          limit: 50,
        }
      );
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
