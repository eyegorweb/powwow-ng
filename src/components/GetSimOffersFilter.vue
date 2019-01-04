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
    },

    async nextPage() {
      this.page += 1;
      const res = await fetchOffers(this.lastSearchTerm, this.selectedPartnersValues, {
        page: this.page,
        limit: 50,
      });
      if (res) {
        this.offers = this.offers.concat(res);
      }
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
