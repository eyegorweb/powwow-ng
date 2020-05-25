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
                  @clear="filterId => clearFilter(filterId)"
                  :selected-data="selectedData"
                  :selected-filters="currentFilters"
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
    defaultValues: {
      type: Array,
      required: false,
    },
  },

  data() {
    return {
      allFiltersVisible: false,
      currentFilters: [],
    };
  },

  computed: {
    canShowSelectedFilter() {
      return this.visibleFilters && this.visibleFilters.length;
    },

    visibleFilters() {
      return this.currentFilters.filter(f => !f.hidden);
    },
  },

  async mounted() {
    for (let i = 0; i < this.filterComponents.length; i++) {
      const filter = this.filterComponents[i];
      if (filter.initialize) {
        await filter.initialize(this.currentFilters);
      }
    }
    if (this.defaultValues) {
      this.currentFilters = [...this.currentFilters, ...this.defaultValues];
    }
    if (this.currentFilters && this.currentFilters.length) {
      this.applyFilters();
    }
  },

  methods: {
    applyFilters() {
      this.$emit('applyFilters', this.currentFilters);
    },
    clearFilter(filterId) {
      if (this.currentFilters && this.currentFilters.length) {
        this.currentFilters = this.currentFilters.filter(f => f.id !== filterId);
      }

      if (!this.visibleFilters || !this.visibleFilters.length) {
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

        const haveEmptyRange =
          selectedValue &&
          (!selectedValue.from || selectedValue.from === '') &&
          (!selectedValue.to || selectedValue.to === '');

        const shouldRemoveFilter = haveEmptyValue || haveEmptyArrayOfValues || haveEmptyRange;
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
