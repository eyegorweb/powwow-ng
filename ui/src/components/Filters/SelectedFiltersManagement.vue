<template>
  <div>
    <SelectedFilters
      :current-filters="currentFilters"
      :fixed-filters="fixedFilters"
      @clear="$emit('clear', $event)"
    />
    <slot />
    <ApplyAndSaveFilters
      v-if="canShowSelectedFilter"
      :current-filters="currentFilters"
      :module-name="moduleName"
      :no-save="noSave"
      :disabled-save="disabledSave"
      :disable-message="disableMessage"
      @applyFilters="$emit('applyFilters', $event)"
      @saved="refreshSavedFilters"
    />
    <FoldableBlock :title="$t('savedFilters')">
      <SavedFilters
        :key="savedFiltersVersion"
        :module-name="moduleName"
        :saved-filters="savedFilters"
        :is-loading="isLoading"
        :current-filters="currentFilters"
        :selected-filter="selectedFilter"
        @chooseFilter="chooseFilter"
        @refresh="refreshSavedFilters"
      />
    </FoldableBlock>
  </div>
</template>

<script>
import SelectedFilters from '@/components/Filters/SelectedFilters';
import ApplyAndSaveFilters from '@/components/Filters/ApplyAndSaveFilters.vue';
import SavedFilters from '@/components/Filters/SavedFilters.vue';
import FoldableBlock from '@/components/FoldableBlock';
import { areFiltersIdentical } from '@/store/filterUtils.js';
import { fetchFilters } from '@/api/filters.js';

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
    noSave: Boolean,
    fixedFilters: {
      type: Array,
      required: false,
    },
  },
  mounted() {
    this.refreshSavedFilters();
  },
  data() {
    return {
      savedFiltersVersion: 0,
      selectedFilter: undefined,
      ignoreNextCurrent: false,
      savedFilters: undefined,
      isLoading: false,
    };
  },
  computed: {
    disabledSave() {
      if (this.savedFilters && this.savedFilters.length >= 4) return true;
      if (this.selectedFilter) {
        const filters = JSON.parse(this.selectedFilter.filter);
        return areFiltersIdentical(filters, this.currentFilters);
      }

      return false;
    },
    disableMessage() {
      if (this.savedFilters && this.savedFilters.length >= 4) {
        return this.$t('getparc.actLines.maxFilters');
      }
      return undefined;
    },
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
    async refreshSavedFilters() {
      this.isLoading = true;
      this.savedFilters = await fetchFilters(this.moduleName);
      this.isLoading = false;
    },
    chooseFilter(selectedFilter) {
      this.ignoreNextCurrent = true;
      if (this.selectedFilter === selectedFilter) {
        this.selectedFilter = undefined;
        this.$emit('chooseFilter', undefined);
      } else {
        this.selectedFilter = selectedFilter;
        this.$emit('chooseFilter', selectedFilter);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
