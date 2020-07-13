<template>
  <div class="mb-3">
    <template v-for="filter in visibleCurrentFilters">
      <SelectedFilterDetails
        :key="filter.name"
        v-if="
          filter &&
            ((filter.values && filter.values.length) ||
              filter.value ||
              filter.startDate ||
              filter.endDate ||
              filter.from ||
              filter.to)
        "
        :filter="filter"
        :fixed="checkIfFilterIsFixed(filter)"
        @clear="onClear"
      />
    </template>
  </div>
</template>

<script>
import SelectedFilterDetails from '@/components/SelectedFilterDetails';

export default {
  name: 'SelectedFilters',

  props: {
    currentFilters: {
      type: Array,
    },
    fixedFilters: {
      type: Array,
      required: false,
    },
  },

  components: { SelectedFilterDetails },
  methods: {
    checkIfFilterIsFixed(item) {
      if (!this.fixedFilters) {
        return false;
      }
      return !!this.fixedFilters.find(c => c.id === item.id);
    },
    onClear(filterId) {
      this.$emit('clear', filterId);
    },
  },
  computed: {
    visibleCurrentFilters() {
      return this.currentFilters.filter(f => !f.hidden);
    },
  },
};
</script>
