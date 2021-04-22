<template>
  <OffersFilter
    :selected-offers-values="selectedOffersValues"
    :selected-partners-values="selectedPartnersValues"
    @setOffersFilter="(values) => setOffersFilter(values)"
  />
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

import OffersFilter from '@/components/Filters/OffersFilter';

export default {
  components: {
    OffersFilter,
  },

  computed: {
    ...mapGetters('getsim', ['selectedOffersValues', 'selectedPartnersValues']),
  },

  methods: {
    ...mapMutations('getsim', ['setOffersFilter']),
  },
};
</script>

<style scoped></style>
