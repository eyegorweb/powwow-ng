<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">FILTRES</h5>
      <PossibleFilters :all-available-filters="allAvailableFilters" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import draggable from 'vuedraggable';
import PossibleFilters from '@/components/filters/choices/PossibleFilters';
import FoldableBlock from '@/components/filters/choices/FoldableBlock';

export default {
  components: {
    draggable,
    FoldableBlock,
    PossibleFilters,
  },

  created() {
    this.loadPossibleFilters();
  },

  computed: {
    ...mapGetters(['allAvailableFilters']),
  },

  methods: {
    ...mapActions(['loadPossibleFilters']),
  },
};
</script>

<style scoped>
</style>
