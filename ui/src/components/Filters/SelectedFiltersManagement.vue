<template>
  <div>
    <SelectedFilters
      :current-filters="currentFilters"
      :fixed-filters="fixedFilters"
      @clear="$emit('clear', $event)"
    />
    <ApplyAndSaveFilters
      v-if="canShowSelectedFilter"
      :current-filters="currentFilters"
      :module-name="moduleName"
      @applyFilters="$emit('applyFilters', $event)"
      @saved="onFilterSaved"
    />
    <FoldableBlock :title="$t('savedFilters')">
      <SavedFilters
        :key="savedFiltersVersion"
        :module-name="moduleName"
        :current-filters="currentFilters"
        :selected-filter="selectedFilter"
        @chooseFilter="chooseFilter"
      />
    </FoldableBlock>
  </div>
</template>

<script>
import SelectedFilters from '@/components/Filters/SelectedFilters';
import ApplyAndSaveFilters from '@/components/Filters/ApplyAndSaveFilters.vue';
import SavedFilters from '@/components/Filters/SavedFilters.vue';
import FoldableBlock from '@/components/FoldableBlock';

export default {
  components: {
    SelectedFilters,
    ApplyAndSaveFilters,
    SavedFilters,
    FoldableBlock,
  },
  props: {
    currentFilters: Array,
    canShowSelectedFilter: Boolean,
    moduleName: String,
    fixedFilters: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      savedFiltersVersion: 0,
      selectedFilter: undefined,
      ignoreNextCurrent: false,
    };
  },
  watch: {
    currentFilters() {
      if (!this.ignoreNextCurrent) {
        this.selectedFilter = undefined;
      } else {
        this.ignoreNextCurrent = false;
      }
    },
  },
  methods: {
    onFilterSaved() {
      this.savedFiltersVersion += 1;
    },
    chooseFilter(selectedFilter) {
      this.ignoreNextCurrent = true;
      this.selectedFilter = selectedFilter;
      this.$emit('chooseFilter', selectedFilter);
    },
  },
};
</script>

<style lang="scss" scoped></style>
