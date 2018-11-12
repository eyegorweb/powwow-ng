<template>
  <div
    class="saved-filters"
  >
    <div
      v-for="filter in currentFilters"
      :key="filter.name"
    >
      <selected-filter-details
        v-if="filter && filter.values && filter.values.length"
        :filter="filter"
      />
    </div>

    <button
      type="button"
      class="btn btn-outline-primary"
    >
      Enregistrer
    </button>
    <button
      disabled
      type="button"
      class="btn btn-gray float-right"
    >
      Appliquer le filtre
    </button>
  </div>
</template>

<script>
import SelectedFilterDetails from './SelectedFilterDetails';

export default {
  name: 'SelectedFilters',
  components: { SelectedFilterDetails },
  props: {
    currentFilters: {
      type: Array,
    },
  },
};
</script>

<style lang="scss">
.saved-filters {
  clear: both;
  margin-bottom: 1em;
}

.saved-filters .btn {
  padding: 0.2rem 1rem;
  font-size: 14px;
}
</style>
