<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
        @applyFilters="applyFilters"
        @clear="filterId => clearFilter(filterId)"
      />

      <draggable handle=".handle">
        <transition-group>
          <FoldableBlock
            v-for="filter in filterComponents"
            :visible="filter.visible"
            :title="$t(filter.title)"
            :key="filter.title"
            draggable
          >
            <FilterBarSlot
              :key="'cmp' + filter.title"
              v-if="filter.component"
              :filter="filter"
              :selected-filters="currentFilters"
            >
              <template slot-scope="{ selectedData }">
                <component
                  :is="filter.component"
                  @change="value => onChangeValue(filter, value)"
                  :selected-data="selectedData"
                />
              </template>
            </FilterBarSlot>
          </FoldableBlock>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import SelectedFilters from '@/components/Filters/SelectedFilters';
import FoldableBlock from '@/components/FoldableBlock';
import draggable from 'vuedraggable';
import FilterBarSlot from './FilterBarSlot';

export default {
  components: {
    SelectedFilters,
    FoldableBlock,
    draggable,
    FilterBarSlot,
  },

  props: {
    filterComponents: Array,
  },

  data() {
    return {
      allFiltersVisible: false,
      currentFilters: [],
    };
  },

  computed: {
    canShowSelectedFilter() {
      return this.currentFilters && this.currentFilters.length;
    },
  },

  methods: {
    applyFilters() {
      this.$emit('applyFilters', this.currentFilters);
    },
    clearFilter(filterId) {
      if (this.currentFilters && this.currentFilters.length) {
        this.currentFilters = this.currentFilters.filter(f => f.id !== filterId);
      }

      if (!this.currentFilters || !this.currentFilters.length) {
        this.$emit('noMoreFilters');
      }
    },
    onChangeValue(filter, value) {
      if (!filter.onChange) {
        return;
      }
      const selectedValue = filter.onChange(value);
      const filterExists = this.currentFilters.find(c => c.id === selectedValue.id);

      if (filterExists) {
        const haveEmptyValue = selectedValue && selectedValue.value === '';
        const haveEmptyArrayOfValues =
          selectedValue && selectedValue.values && selectedValue.values.length === 0;

        const shouldRemoveFilter = haveEmptyValue || haveEmptyArrayOfValues;
        if (shouldRemoveFilter) {
          this.currentFilters = this.currentFilters.filter(f => f.id !== selectedValue.id);
        }
        this.currentFilters = this.currentFilters.map(c => {
          if (c.id === selectedValue.id) {
            return selectedValue;
          }
          return c;
        });
      } else {
        if (selectedValue) {
          this.currentFilters.push(selectedValue);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
