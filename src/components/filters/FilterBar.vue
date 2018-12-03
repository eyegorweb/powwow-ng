<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">FILTRES</h5>
      <SelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
      />
      <PossibleFilters :all-available-filters="allAvailableFilters" />
    </div>
  </div>
</template>
<style lang="scss">
.filter-bar .card-title {
  padding: 0.3em 0.5em 0.3em 0;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex';

import SelectedFilters from './selected/SelectedFilters';
import PossibleFilters from './choices/PossibleFilters';

export default {
  name: 'FilterBar',
  components: {
    SelectedFilters,
    PossibleFilters,
  },

  created() {
    this.loadPossibleFilters();
  },

  computed: {
    ...mapGetters(['allAvailableFilters', 'currentFilters', 'canShowSelectedFilter']),
  },
  methods: {
    ...mapActions(['loadPossibleFilters']),
  },
};
</script>
