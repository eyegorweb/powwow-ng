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
      canFetchNextPage: true,
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
    ...mapMutations('getsim', ['setBillingAccountsFilter']),

    async fetchFormattedBillingAccountForDatatable(q, { page, limit }) {
      const data = await fetchBillingAccounts(q, this.selectedPartnersValues, { page, limit });
      if (data) {
        return data.map(p => ({
          id: p.id,
          label: `${p.code} - ${p.name}`,
          partnerId: p.party.id,
        }));
      }
      return undefined;
    },

    async searchValueChanged(q) {
      this.billingAccounts = await this.fetchFormattedBillingAccountForDatatable(q, {
        page: 0,
        limit: 10,
      });
      this.lastSearchTerm = q;
      this.page = 0;
      this.canFetchNextPage = true;
    },
    async nextPage() {
      if (!this.canFetchNextPage) return;

      this.page += 1;
      const res = await this.fetchFormattedBillingAccountForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      if (res && res.length > 0) {
        this.billingAccounts = this.billingAccounts.concat(res);
      } else {
        this.canFetchNextPage = false;
      }
    },
  },

  watch: {
    async selectedPartnersValues() {
      this.page = 0;
      this.canFetchNextPage = true;
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
    ...mapGetters('getsim', ['selectedPartnersValues', 'selectedBillingAccountsValues']),

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

<style scoped></style>
