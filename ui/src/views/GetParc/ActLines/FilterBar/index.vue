<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFiltersManagement
        module-name="SIM"
        can-show-selected-filter
        :current-filters="currentFilters"
        :fixed-filters="fixedFilters"
        :no-save="!filtersHaveValues"
        @clear="(filterId) => clearFilter(filterId)"
        @applyFilters="applyFilters"
        @chooseFilter="chooseFilter"
      >
        <div v-if="!filtersHaveValues" class="alert alert-info">{{ $t('noFilter') }}</div>
      </SelectedFiltersManagement>
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Filters from './Filters';

import SelectedFiltersManagement from '@/components/Filters/SelectedFiltersManagement.vue';
import { getPartyOptions } from '@/api/partners.js';
import { areFiltersEmpty } from '@/store/filterUtils.js';
import { getFiltersStorage, setFiltersStorage } from '@/utils/localstorage.js';

export default {
  components: {
    draggable,
    SelectedFiltersManagement,
    Filters,
  },
  props: {
    creationMode: Boolean,
  },
  data() {
    return {
      allFiltersVisible: false,
      ipFixeEnabled: false,
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
        {
          key: 'el10',
          id: 10,
        },
        {
          key: 'el11',
          id: 11,
        },
        {
          key: 'el12',
          id: 12,
        },
        {
          key: 'el13',
          id: 13,
        },
        {
          key: 'el14',
          id: 14,
        },
        {
          key: 'el15',
          id: 15,
        },
        {
          key: 'el16',
          id: 16,
        },
        {
          key: 'el17',
          id: 17,
        },
        {
          key: 'el18',
          id: 18,
        },
        {
          key: 'el19',
          id: 19,
        },
        {
          key: 'el20',
          id: 20,
        },
        {
          key: 'el21',
          id: 21,
        },
        {
          key: 'el22',
          id: 22,
        },
        {
          key: 'el23',
          id: 23,
        },
        {
          key: 'el24',
          id: 24,
        },
        {
          key: 'el25',
          id: 25,
        },
        {
          key: 'el26',
          id: 26,
        },
        {
          key: 'el27',
          id: 27,
        },
        {
          key: 'el28',
          id: 28,
        },
        {
          key: 'el29',
          id: 29,
        },
        {
          key: 'el30',
          id: 30,
        },
        {
          key: 'esim1',
          id: 31,
        },
        {
          key: 'esim2',
          id: 32,
        },
        {
          key: 'esim3',
          id: 33,
        },
        {
          key: 'esim4',
          id: 34,
        },
        {
          key: 'downloadedProfile',
          id: 35,
        },
        {
          key: 'esim5',
          id: 36,
        },
        {
          key: 'esim6',
          id: 37,
        },
        {
          key: 'esim7',
          id: 38,
        },
      ],
      nbOfFilters: 10,
    };
  },
  watch: {
    filtersName(newValue) {
      setFiltersStorage(newValue, 1, 'filtersGetParc');
    },
  },
  computed: {
    ...mapState('actLines', ['actToCreate']),
    ...mapGetters(['userIsPartner', 'userInfos']),
    ...mapGetters('actLines', ['currentFilters', 'canShowSelectedFilter']),

    filtersNameSlice() {
      return this.filtersName.slice(0, this.nbOfFilters);
    },

    filtersHaveValues() {
      if (this.currentFilters) {
        const visibleFilters = this.currentFilters.filter((f) => !f.hidden);
        if (!areFiltersEmpty(visibleFilters)) {
          return true;
        }
      }
      return false;
    },
    canShowSelectedFilterOrButtons() {
      if (!this.creationMode) {
        if (this.currentFilters) {
          const visibleFilters = this.currentFilters.filter((f) => !f.hidden);
          if (visibleFilters.length) {
            return true;
          }
        }
      }
      return this.canShowSelectedFilter;
    },
    fixedFilters() {
      if (this.actToCreate) {
        return this.actToCreate.filters;
      }
      return [];
    },
  },
  mounted() {
    this.fetchPartnerOptions();
    if (getFiltersStorage('filtersGetParc') && getFiltersStorage('filtersGetParc').filters) {
      const filtersFromStorage = getFiltersStorage('filtersGetParc');
      if (filtersFromStorage && filtersFromStorage.filters) {
        this.filtersName = filtersFromStorage.filters;
      }
    }
  },
  methods: {
    ...mapMutations('actLines', ['applyFilters', 'setCurrentFilters']),
    ...mapActions('actLines', ['clearFilter']),

    async fetchPartnerOptions() {
      let response;
      if (this.userIsPartner || this.userInfos.type === 'PARTNER_GROUP') {
        response = await getPartyOptions(this.userInfos.partners[0].id);
        this.ipFixeEnabled = response ? response.ipFixeEnable : true;
      } else {
        this.ipFixeEnabled = true;
      }
    },

    showAllFilters() {
      this.nbOfFilters = this.nbOfFilters === 10 ? 40 : 10;
      this.allFiltersVisible = !this.allFiltersVisible;
    },

    chooseFilter(savedFilters) {
      if (!savedFilters) {
        this.setCurrentFilters([]);
        this.applyFilters();
      }
      if (savedFilters && savedFilters.filter && savedFilters.filter.length) {
        const filters = JSON.parse(savedFilters.filter);
        if (filters) {
          this.setCurrentFilters(filters);
          this.applyFilters();
        }
      }
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
