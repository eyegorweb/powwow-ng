<template>
  <MultiSelectSearch
    :items="formattedOffers"
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
    };
  },

  async mounted() {
    this.offers = await fetchOffers('', this.selectedPartnersValues, {
      page: 1,
      limit: 50,
    });
  },

  methods: {
    ...mapMutations(['setOffersFilter']),

    async searchValueChanged(q) {
      this.offers = await fetchOffers(q, this.selectedPartnersValues, {
        page: 1,
        limit: 50,
      });
      this.lastSearchTerm = q;
      this.page = 1;
      this.canFetchNextPage = true;
    },

    async nextPage() {
      this.page += 1;
      const res = await fetchOffers(this.lastSearchTerm, this.selectedPartnersValues, {
        page: this.page,
        limit: 50,
      });

      if (res && res.length > 0) {
        this.offers = this.offers.concat(res);
      } else {
        this.canFetchNextPage = false;
      }
    },
  },

  computed: {
    ...mapGetters(['selectedPartnersValues', 'selectedOffersValues']),

    formattedOffers() {
      return this.offers.map(i => {
        return { id: i.code, label: i.workflowDescription };
      });
    },

    selectedOffers: {
      get() {
        return this.selectedOffersValues;
      },
      set(offers) {
        this.setOffersFilter(offers);
      },
    },
  },

  watch: {
    async selectedPartnersValues() {
      this.page = 0;
      this.canFetchNextPage = true;
      this.offers = await fetchOffers(this.lastSearchTerm, this.selectedPartnersValues, {
        page: this.page,
        limit: 50,
      });
    },
  },
};
</script>

<style scoped>
</style>
