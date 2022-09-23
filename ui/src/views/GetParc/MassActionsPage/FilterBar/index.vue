<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>

      <div class="alert alert-warning" role="alert" v-if="noDatesInFilters">
        {{ $t('common.noDateChosenError') }}
      </div>
      <SelectedFilters
        :current-filters="currentFilters"
        @applyFilters="applyFilters"
        @clear="(filterId) => clearFilter(filterId)"
        :fixed-filters="fixedFilters"
      >
        <template #actions>
          <div class="actions d-flex flex-column flex-md-row mb-2">
            <UiButton
              :disabled="!canShowSelectedFilter"
              variant="primary"
              @click="applyFilters"
              class="flex-grow-1 py-1 px-3 ml-1 apply-filters-btn"
              >{{ $t('search') }}
            </UiButton>
          </div>
        </template>
      </SelectedFilters>

      <draggable handle=".handle" :list="filtersName">
        <transition-group>
          <div v-for="item in filtersNameSlice" :key="item.id">
            <Filters :key-name="item.key" />
          </div>
        </transition-group>
      </draggable>
    </div>
    <div class="text-right">
      <a
        v-if="!allFiltersVisible"
        href="#"
        @click.prevent="showAllFilters"
        class="show-all-types text-right"
      >
        {{ $t('moreFilters') }}
        <i class="arrow ic-Arrow-Down-Icon" />
      </a>
    </div>
    <div class="text-right">
      <a
        v-if="allFiltersVisible"
        href="#"
        @click.prevent="showAllFilters"
        class="show-all-types text-right"
      >
        {{ $t('lessFilters') }}
        <i class="arrow ic-Arrow-Up-Icon" />
      </a>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import SelectedFilters from '@/components/Filters/SelectedFilters';
import UiButton from '@/components/ui/Button';
import Filters from './Filters';
import { getFiltersStorage, setFiltersStorage } from '@/utils/localstorage.js';

export default {
  components: {
    draggable,
    SelectedFilters,
    UiButton,
    Filters,
  },
  data() {
    return {
      allFiltersVisible: false,
      filtersName: [
        {
          key: 'el1',
          id: 1,
        },
        {
          key: 'el2',
          id: 2,
        },
        {
          key: 'el3',
          id: 3,
        },
        {
          key: 'el4',
          id: 4,
        },
        {
          key: 'el5',
          id: 5,
        },
        {
          key: 'el6',
          id: 6,
        },
        {
          key: 'el7',
          id: 7,
        },
        {
          key: 'el8',
          id: 8,
        },
        {
          key: 'el9',
          id: 9,
        },
      ],
      nbOfFilters: 6,
    };
  },
  watch: {
    filtersName(newValue) {
      setFiltersStorage(newValue, 1, 'filtersHistoryAct');
    },
  },
  mounted() {
    if (getFiltersStorage('filtersHistoryAct') && getFiltersStorage('filtersHistoryAct').filters) {
      const filtersFromStorage = getFiltersStorage('filtersHistoryAct');
      this.filtersName = filtersFromStorage.filters;
    }
  },
  computed: {
    ...mapGetters(['userInfos', 'userIsMVNO']),
    ...mapGetters('actHistory', [
      'currentFilters',
      'canShowSelectedFilter',
      'selectedPartnersValues',
      'selectedOrderCreatorValues',
    ]),

    filtersNameSlice() {
      return this.filtersName.slice(0, this.nbOfFilters);
    },

    fixedFilters() {
      if (
        this.currentFilters.find((f) => f.id === 'filters.lines.error') &&
        this.currentFilters.find((f) => f.id === 'filters.lines.error').values &&
        this.currentFilters.find((f) => f.id === 'filters.lines.error').values.length > 0
      ) {
        return [{ id: 'filters.actStatus', values: [{ id: 'IN_ERROR', label: 'En échec' }] }];
      }
      return [];
    },

    noDatesInFilters() {
      if (this.currentFilters && this.currentFilters.length) {
        const dateFilters = [
          'filters.actDateStart',
          'filters.actDateCreation',
          'filters.actDateEnd',
        ];
        return !this.currentFilters.filter((f) => dateFilters.indexOf(f.id) > -1).length;
      }
      return true;
    },
  },
  methods: {
    ...mapMutations('actHistory', ['applyFilters', 'setOrderCreatorFilter', 'selectErrorFilter']),
    ...mapActions('actHistory', ['clearFilter']),

    showAllFilters() {
      this.allFiltersVisible = !this.allFiltersVisible;
      this.nbOfFilters = this.nbOfFilters === 6 ? 40 : 6;
    },
  },
};
</script>

<style lang="scss" scoped>
.card-body {
  transition: max-height 0.25s ease-out;
  max-height: 100%;
  overflow: hidden;
  padding-bottom: 0;
}
.checkbox-container .checkmark {
  border: 1px solid $medium-gray;
}

.checkbox-container .checkmark.regular {
  &:after {
    border-color: $dark-gray;
  }
}

.hide-all-filters {
  transition: all 0.5s ease-in;

  .foldable-block:nth-child(n + 7) {
    //par défaut on affiche 6 items
    display: none;
  }
}

.show-all-filters {
  transition: all 0.5s ease-in;

  .foldable-block:nth-child(n + 7) {
    //par défaut on affiche 6 items
    display: block;
  }
}

.text-right {
  & a {
    color: $dark-gray;
    display: block;
    padding: 0.75rem 1.25rem;
    &:hover {
      color: $secondary;
      text-decoration: none;
    }
  }
}
</style>
