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
    <slot name="actions" :hasAnyValue="hasAnyValue"></slot>
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
    hasAnyValue() {
      return (
        this.currentFilters &&
        !!this.currentFilters.find(f => {
          return (
            (f.values && f.values.length > 0) ||
            (f.value && f.value !== '') ||
            f.startDate ||
            f.endDate ||
            f.from ||
            f.to
          );
        })
      );
    },
  },
};
</script>
