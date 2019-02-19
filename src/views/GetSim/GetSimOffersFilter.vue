<template>
  <MultiSelectSearch
    :items="offers"
    :default-selected-items.sync="selectedOffers"
    @update:search="searchValueChanged"
    @scroll:limit="nextPage"
  />
</template>

<script>
import MultiSelectSearch from '@/components/ui/MultiSelectSearch';
import { mapMutations, mapGetters } from 'vuex';

import { fetchOffers } from '@/api/offers';

export default {
  components: {
    MultiSelectSearch,
  },
  data() {
    return {
      offers: [],
      lastSearchTerm: '',
      canFetchNextPage: true,
      page: 0,
    };
  },

  async mounted() {
    this.offers = await this.fetchFormattedOffersForDatatable('', {
      page: 0,
      limit: 10,
    });
  },

  methods: {
    ...mapMutations(['setOffersFilter']),

    async fetchFormattedOffersForDatatable(q, { page, limit }) {
      const data = await fetchOffers(q, this.selectedPartnersValues, { page, limit });
      if (data) {
        return data.map(o => ({
          id: o.code,
          label: o.workflowDescription,
        }));
      }
      return undefined;
    },

    async searchValueChanged(q) {
      this.offers = await this.fetchFormattedOffersForDatatable(q, {
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
      const res = await this.fetchFormattedOffersForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 10,
      });
      if (res && res.length > 0) {
        this.offers = this.offers.concat(res);
      } else {
        this.canFetchNextPage = false;
      }
    },
  },

  watch: {
    async selectedPartnersValues() {
      this.page = 0;
      this.canFetchNextPage = true;
      this.offers = await this.fetchFormattedOffersForDatatable(this.lastSearchTerm, {
        page: this.page,
        limit: 50,
      });
    },
  },

  computed: {
    ...mapGetters(['selectedPartnersValues', 'selectedOffersValues']),

    selectedOffers: {
      get() {
        return this.selectedOffersValues;
      },
      set(offers) {
        this.setOffersFilter(offers);
      },
    },
  },
};
</script>

<style scoped>
</style>
