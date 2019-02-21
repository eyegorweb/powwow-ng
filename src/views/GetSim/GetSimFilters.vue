<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[ allFiltersVisible ? 'show-all-filters' : 'hide-all-filters' ]">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <!-- TODO: a voir si ces computed properties sont toujours d'actualité -->
      <GetSimSelectedFilters v-if="canShowSelectedFilter" :current-filters="currentFilters" />
      <draggable>
        <transition-group>
          <FoldableBlock :title="$t('filters.partners')" :key="'el1'" draggable>
            <GetSimPartnersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable>
            <GetSimPartnersBillingAccountsFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderStatus')" :key="'el3'" draggable>
            <div>
              <UiCheckbox
                v-for="status in statusResults"
                :checked="status.checked"
                :value="{'id': status, 'label': $t(`col.statuses. ${status}`)}"
                :key="status"
                v-model="orderStatus"
              >{{ $t(`col.statuses. ${status}`) }}</UiCheckbox>
            </div>
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
          <FoldableBlock :title="$t('filters.customFields')" :key="'el8'" draggable>
            <GetSimCustomFields />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderCreator')" :key="'el9'" draggable>
            <GetSimOrderCreator />
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
        Plus de filtres
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
        Moins de filtres
        <i class="arrow ic-Arrow-Up-Icon" />
      </a>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations } from 'vuex';
import FoldableBlock from '@/components/FoldableBlock';
import UiCheckbox from '@/components/ui/Checkbox';
import { fetchOrderStatuses } from '@/api/orderStatuses';
import GetSimCustomFields from './GetSimCustomFields';
import GetSimSelectedFilters from './GetSimSelectedFilters';
import GetSimPartnersFilter from './GetSimPartnersFilter';
import GetSimPartnersBillingAccountsFilter from './GetSimPartnersBillingAccountsFilter';
import GetSimOffersFilter from './GetSimOffersFilter';
import GetSimOrderCreator from './GetSimOrderCreatorFilter';
import GetSimPostalCode from './GetSimPostalCode';
import GetSimCity from './GetSimCity';
import GetSimActionFilter from './GetSimActionFilter';
import GetSimQuantityFilter from './GetSimQuantityFilter';
import GetSimDateFilter from './GetSimDateFilter';
import GetSimDeliveryCountries from './GetSimDeliveryCountries';

export default {
  data() {
    return {
      statusResults: [],
      allFiltersVisible: false,
      maximumNumberOfVisibleBlocksByDefault: 6,
    };
  },

  computed: {
    ...mapGetters([
      'currentFilters',
      'canShowSelectedFilter',
      'selectedOrderDate',
      'selectedOrderStatus',
    ]),
    orderStatus: {
      get() {
        return this.selectedOrderStatus;
      },
      set(newValue) {
        this.setOrderStatusFilter(newValue);
      },
    },
  },

  methods: {
    ...mapMutations(['setOrderStatusFilter']),
    setOrderDateFilter({ start: startDate, end: endDate }) {
      this.$store.commit('setOrderDateFilter', { startDate, endDate });
    },
    showAllFilters() {
      this.allFiltersVisible = !this.allFiltersVisible;
    },
  },

  async created() {
    this.statusResults = await fetchOrderStatuses();
  },

  components: {
    draggable,
    FoldableBlock,
    GetSimPartnersFilter,
    GetSimCustomFields,
    GetSimSelectedFilters,
    GetSimPartnersBillingAccountsFilter,
    GetSimOffersFilter,
    UiCheckbox,
    GetSimOrderCreator,
    GetSimPostalCode,
    GetSimCity,
    GetSimActionFilter,
    GetSimQuantityFilter,
    GetSimDateFilter,
    GetSimDeliveryCountries,
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
