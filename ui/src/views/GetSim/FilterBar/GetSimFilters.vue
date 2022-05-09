<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>

      <SelectedFiltersManagement
        module-name="ORDER"
        can-show-selected-filter
        :current-filters="currentFilters"
        :no-save="!filtersHaveValues"
        @applyFilters="applyFilters"
        @chooseFilter="chooseFilter"
        @clear="(filterId) => clearFilter(filterId)"
      >
        <div v-if="!filtersHaveValues" class="alert alert-info">{{ $t('noFilter') }}</div>
      </SelectedFiltersManagement>

      <draggable handle=".handle" :list="filtersName">
        <transition-group>
          <div v-for="item in filtersName" :key="item.id">
            <Filters
              :key-name="item.key"
              :status-map-results="statusMapResults"
              :order-status="orderStatus"
            />
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
import { fetchOrderStatuses } from '@/api/orderStatuses';

import { areFiltersEmpty } from '@/store/filterUtils.js';
import Filters from './Filters';

import SelectedFiltersManagement from '@/components/Filters/SelectedFiltersManagement.vue';
import { getFiltersStorage, setFiltersStorage } from '@/utils/localstorage.js';

export default {
  data() {
    return {
      statusMapResults: [],
      allFiltersVisible: false,
      maximumNumberOfVisibleBlocksByDefault: 6,
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
      ],
    };
  },

  computed: {
    ...mapGetters('getsim', ['currentFilters', 'selectedOrderStatus']),
    ...mapGetters(['userIsPartner', 'userInfos', 'userIsMVNO', 'userIsM2MLight']),
    orderStatus: {
      get() {
        return this.selectedOrderStatus;
      },
      set(newValue) {
        this.setOrderStatusFilter(newValue);
      },
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
  },
  watch: {
    filtersName(newValue) {
      setFiltersStorage(newValue, 1, 'filtersGetSim');
    },
  },
  methods: {
    ...mapActions('getsim', ['setPartnersFilter', 'clearFilter']),
    ...mapMutations('getsim', [
      'setOrderStatusFilter',
      'applyFilters',
      'setOrderCreatorFilter',
      'setCurrentFilters',
    ]),
    setOrderDateFilter({ start: startDate, end: endDate }) {
      this.$store.commit('setOrderDateFilter', { startDate, endDate });
    },
    showAllFilters() {
      this.allFiltersVisible = !this.allFiltersVisible;
    },
    chooseFilter(savedFilters) {
      if (savedFilters && savedFilters.filter && savedFilters.filter.length) {
        const filters = JSON.parse(savedFilters.filter);
        if (filters) {
          this.setCurrentFilters(filters);
          this.applyFilters();
        }
      }
    },
    async formatOrderStatuses() {
      const statuses = await fetchOrderStatuses();
      let mapStatus = new Map();
      const prefixMessage = this.userIsM2MLight ? 'col.statuses.m2mLight.' : 'col.statuses.';
      statuses.forEach((status) => {
        let vKey = this.$t(prefixMessage + status);
        if (vKey === prefixMessage + status) {
          vKey = this.$t('other');
        }
        let newValue = '';
        if (mapStatus.has(vKey)) {
          newValue = mapStatus.get(vKey).concat(', ', status);
        } else {
          newValue = status;
        }
        mapStatus.set(vKey, newValue);
      });
      let arrayStatus = Array.from(mapStatus);
      const index = arrayStatus.findIndex((s) => s[0] === this.$t('other'));
      if (index !== -1) {
        arrayStatus.push(arrayStatus.splice(index, 1)[0]);
      }
      return arrayStatus;
    },
  },

  async mounted() {
    this.statusMapResults = await this.formatOrderStatuses();
    if (getFiltersStorage('filtersGetSim')) {
      const filtersFromStorage = getFiltersStorage('filtersGetSim');
      this.filtersName = filtersFromStorage.filters;
    }
  },

  components: {
    draggable,
    SelectedFiltersManagement,
    Filters,
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
