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

      <draggable handle=".handle">
        <transition-group>
          <FoldableBlock
            v-if="!userIsPartner"
            :title="$t('filters.partners')"
            :key="'el1'"
            draggable
          >
            <GetSimPartnersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable>
            <GetSimPartnersBillingAccountsFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderStatus')" :key="'el3'" draggable>
            <div>
              <UiCheckbox
                v-for="(status, index) in statusMapResults"
                :checked="status[1].checked"
                :value="{ id: status[1], label: status[0] }"
                :key="'orderStatus_' + index"
                v-model="orderStatus"
                >{{ status[0] }}</UiCheckbox
              >
            </div>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.typeSIMCard')" :key="'el4'" draggable>
            <TypeSimCard />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderDate')" :key="'el5'" draggable>
            <GetSimDateFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.offers')" :key="'el6'" draggable>
            <GetSimOffersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.quantity')" :key="'el7'" draggable>
            <GetSimQuantityFilter />
          </FoldableBlock>
          <FoldableBlock
            v-if="!userIsMVNO"
            :title="$t('filters.customFields')"
            :key="'el8'"
            draggable
          >
            <GetSimCustomFields />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderCreator')" :key="'el9'" draggable>
            <OrderCreatorFilter
              :selected-partners-values="selectedPartnersValues"
              :selected-order-creator-values="selectedOrderCreatorValues"
              @setOrderCreatorFilter="setOrderCreatorFilter"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.deliveryCountry')" :key="'el11'" draggable>
            <GetSimDeliveryCountries />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.postalCode')" :key="'el12'" draggable>
            <GetSimPostalCode />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.city')" :key="'el20'" draggable>
            <GetSimCity />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.action')" :key="'e21'" draggable>
            <GetSimActionFilter />
          </FoldableBlock>
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
import FoldableBlock from '@/components/FoldableBlock';
import UiCheckbox from '@/components/ui/Checkbox';
import { fetchOrderStatuses } from '@/api/orderStatuses';
import GetSimCustomFields from './GetSimCustomFields';
import GetSimPartnersFilter from './GetSimPartnersFilter';
import GetSimPartnersBillingAccountsFilter from './GetSimPartnersBillingAccountsFilter';
import GetSimOffersFilter from './GetSimOffersFilter';
import GetSimPostalCode from './GetSimPostalCode';
import GetSimCity from './GetSimCity';
import GetSimActionFilter from './GetSimActionFilter';
import GetSimQuantityFilter from './GetSimQuantityFilter';
import GetSimDateFilter from './GetSimDateFilter';
import GetSimDeliveryCountries from './GetSimDeliveryCountries';
import OrderCreatorFilter from '@/components/Filters/OrderCreatorFilter';
import TypeSimCard from './TypeSimCard';
import { areFiltersEmpty } from '@/store/filterUtils.js';

import SelectedFiltersManagement from '@/components/Filters/SelectedFiltersManagement.vue';

export default {
  data() {
    return {
      statusMapResults: [],
      allFiltersVisible: false,
      maximumNumberOfVisibleBlocksByDefault: 6,
    };
  },

  computed: {
    ...mapGetters('getsim', [
      'currentFilters',
      'canShowSelectedFilter',
      'selectedOrderDate',
      'selectedOrderStatus',
      'selectedPartnersValues',
      'selectedOrderCreatorValues',
    ]),
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
  },

  components: {
    draggable,
    FoldableBlock,
    GetSimPartnersFilter,
    GetSimCustomFields,
    GetSimPartnersBillingAccountsFilter,
    GetSimOffersFilter,
    UiCheckbox,
    GetSimPostalCode,
    GetSimCity,
    GetSimActionFilter,
    GetSimQuantityFilter,
    GetSimDateFilter,
    GetSimDeliveryCountries,
    OrderCreatorFilter,
    TypeSimCard,

    SelectedFiltersManagement,
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
