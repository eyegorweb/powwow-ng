<template>
  <div class="card filter-bar cmp-filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <slot name="beforeSelectedFilters"> </slot>
      <div v-if="!filtersHaveValues" class="alert alert-info">{{ $t('noFilter') }}</div>

      <SelectedFilters
        :current-filters="currentFilters"
        :fixed-filters="frozenValues"
        @applyFilters="applyFilters"
        @clear="onRemoveFilter"
        :hide-apply="alwaysShowButton"
        can-save
      >
        <template #actions="{ hasAnyValue }">
          <slot name="actions" :hasAnyValue="hasAnyValue" :onSearch="applyFilters"></slot>
        </template>
      </SelectedFilters>
      <div
        v-if="alwaysShowButton && !allAreHidden"
        class="actions d-flex flex-column flex-md-row mb-2"
      >
        <UiButton
          variant="primary"
          @click="applyFilters"
          class="apply-filters-btn flex-grow-1 py-1 px-3 ml-1"
        >
          {{ $t('applyFilters') }}
        </UiButton>
      </div>

      <draggable handle=".handle" :list="filtersSort">
        <transition-group>
          <FoldableBlock
            v-for="filter in visibleComponents"
            :title="$t(filter.title)"
            :key="filter.title"
            :disabled="disabled"
            :hidden="filter.isHidden && filter.isHidden()"
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
                  @change="(value) => onChangeValue(filter, value)"
                  @clear="(filterId) => clearFilter(filterId)"
                  :selected-data="selectedData"
                  :selected-filters="currentFilters"
                  :get-page-context="filter.getPageContext"
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
import UiButton from '@/components/ui/Button';
import FilterBarSlot from './FilterBarSlot';
import { areFiltersEmpty } from '@/store/filterUtils.js';
import { getFiltersStorage, setFiltersStorage } from '@/utils/localstorage.js';

export default {
  components: {
    SelectedFilters,
    FoldableBlock,
    draggable,
    FilterBarSlot,
    UiButton,
  },

  props: {
    storageVersion: String,
    storageId: String,
    filterComponents: Array,
    alwaysShowButton: Boolean,
    disabled: Boolean,
    defaultValues: {
      type: Array,
      required: false,
    },

    frozenValues: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      allFiltersVisible: false,
      currentFilters: [],
      filtersSort: [],
    };
  },

  watch: {
    filtersSort(newValue) {
      setFiltersStorage(newValue, this.storageVersion, this.storageId)
    },
    currentFilters(currentFilters) {
      this.$emit('currentFiltersChange', currentFilters);
    },
  },

  computed: {
    filtersHaveValues() {
      if (this.currentFilters) {
        const visibleFilters = this.currentFilters.filter((f) => !f.hidden);
        if (!areFiltersEmpty(visibleFilters)) {
          return true;
        }
      }
      return false;
    },
    allAreHidden() {
      const hiddenFilters = this.visibleComponents.filter((filter) => {
        return filter.isHidden && filter.isHidden();
      });

      return hiddenFilters.length === this.visibleComponents.length;
    },
    canShowSelectedFilter() {
      return this.visibleFilters && this.visibleFilters.length;
    },

    visibleFilters() {
      return this.currentFilters.filter((f) => !f.hidden);
    },

    visibleComponents() {
      if (!this.filtersSort) return [];
      return this.filtersSort.filter(
        (filter) => !filter.checkVisibleFn || filter.checkVisibleFn(this.currentFilters)
      );
    },
  },

  async mounted() {
    this.filtersSort = this.filterComponents;

    if(getFiltersStorage(this.storageId)) {
      const filtersFromStorage = getFiltersStorage(this.storageId);
      console.log(filtersFromStorage.filters)
      this.filtersSort  = filtersFromStorage.filters;
    }
    for (let i = 0; i < this.filtersSort.length; i++) {
      const filter = this.filtersSort[i];
      if (filter.initialize) {
        await filter.initialize(this.currentFilters);
      }
    }
    if (!this.currentFilters.length) {
      this.currentFilters = [...this.frozenValues];
    }

    if (this.defaultValues) {
      const currentFilters = [...this.currentFilters, ...this.defaultValues];

      // remove duplicates from array
      this.currentFilters = currentFilters.filter((f, index) => {
        const valueIndex = currentFilters.findIndex((s) => s.id === f.id);
        return valueIndex === index;
      });
    }

    if (this.currentFilters && this.currentFilters.length) {
      this.applyFilters();
    }
  },

  methods: {
    applyFilters() {
      this.$emit('applyFilters', this.currentFilters);
    },
    onRemoveFilter(filterId) {
      const filterToRemove = this.filtersSort.find((f) => f.title === filterId);
      if (filterToRemove) {
        if (filterToRemove.onRemove) {
          filterToRemove.onRemove(this.clearFilter);
        }
        this.clearFilter(filterId);
      }
    },
    clearFilter(filterId) {
      if (this.currentFilters && this.currentFilters.length) {
        this.currentFilters = this.currentFilters.filter((f) => f.id !== filterId);
      }

      if (!this.visibleFilters || !this.visibleFilters.length) {
        this.$emit('noMoreFilters');
      }
    },
    onChangeValue(filter, value) {
      if (!filter.onChange) {
        return;
      }
      const selectedValue = filter.onChange(value, this.clearFilter);
      const filterExists = this.currentFilters.find((c) => c.id === selectedValue.id);

      if (filterExists) {
        const haveEmptyValue = selectedValue && selectedValue.value === '';
        const haveEmptyArrayOfValues =
          selectedValue && selectedValue.values && selectedValue.values.length === 0;

        let haveEmptyRange = false;

        if (selectedValue && (selectedValue.from || selectedValue.to)) {
          haveEmptyRange = selectedValue.from === '' && selectedValue.to === '';
        }

        const shouldRemoveFilter = haveEmptyValue || haveEmptyArrayOfValues || haveEmptyRange;
        if (shouldRemoveFilter) {
          this.currentFilters = this.currentFilters.filter((f) => f.id !== selectedValue.id);
        }
        this.currentFilters = this.currentFilters.map((c) => {
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
