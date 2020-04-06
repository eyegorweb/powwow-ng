<template>
  <div>
    <slot :selectedData="selectedValue"></slot>
  </div>
</template>

<script>
export default {
  props: {
    selectedFilters: Array,
    filter: Object,
  },
  computed: {
    selectedValue: {
      get() {
        const selectedFilter = this.selectedFilters.find(f => f.id === this.filter.title);

        if (selectedFilter) {
          return {
            ...selectedFilter,
            // pour assurer la rétro compatibilité
            ...selectedFilter.data,
          };
        }

        return undefined;
      },

      set(newValue) {
        const selected = this.options.find(o => o.value === newValue);
        this.$emit('change', selected);
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
