<template>
  <div class="card filter-bar">
    <div class="card-body">
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
                :value="status.label"
                :key="status.id"
              >{{ status.label }}</UiCheckbox>
            </div>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderReference')" :key="'el4'" draggable />
          <FoldableBlock :title="$t('filters.orderDate')" :key="'el5'" draggable>
            <UiDateRange :start.sync="startDate" :end.sync="endDate" />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.offers')" :key="'el6'" draggable>
            <GetSimOffersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.quantity')" :key="'el7'" draggable />
          <FoldableBlock :title="$t('filters.customFields')" :key="'el8'" draggable>
            <GetSimCustomFields />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderCreator')" :key="'el9'" draggable>
            <GetSimOrderCreator />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.active')" :key="'el10'" draggable />
          <FoldableBlock :title="$t('filters.deliveryCountry')" :key="'el11'" draggable />
          <FoldableBlock :title="$t('filters.postalCode')" :key="'el12'" draggable />
          <FoldableBlock :title="$t('filters.city')" :key="'el13'" draggable />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters, mapMutations } from 'vuex';
import FoldableBlock from '@/components/FoldableBlock';
import UiCheckbox from '@/components/ui/Checkbox';
import UiDateRange from '@/components/ui/UiDateRange';
import { fetchOrderStatuses } from '@/api/orderStatuses';
import GetSimCustomFields from './GetSimCustomFields';
import GetSimSelectedFilters from './GetSimSelectedFilters';
import GetSimPartnersFilter from './GetSimPartnersFilter';
import GetSimPartnersBillingAccountsFilter from './GetSimPartnersBillingAccountsFilter';
import GetSimOffersFilter from './GetSimOffersFilter';
import GetSimOrderCreator from './GetSimOrderCreatorFilter';

export default {
  computed: {
    ...mapGetters(['currentFilters', 'canShowSelectedFilter', 'selectedOrderDate']),
    startDate: {
      get: ({ selectedOrderDate, localOrderDate }) =>
        (selectedOrderDate && selectedOrderDate.startDate) || localOrderDate.startDate,
      set(startDate) {
        this.localOrderDate.startDate = startDate;
        this.setOrderDateFilter({ startDate, endDate: this.endDate });
      },
    },
    endDate: {
      get: ({ selectedOrderDate, localOrderDate }) =>
        (selectedOrderDate && selectedOrderDate.endDate) || localOrderDate.endDate,
      set(endDate) {
        this.localOrderDate.endDate = endDate;
        this.setOrderDateFilter({ startDate: this.startDate, endDate });
      },
    },
  },

  data() {
    return {
      statusResults: [],
      // save a local version as updating the store filter only accept both values
      localOrderDate: {
        startDate: null,
        endDate: null,
      },
    };
  },

  methods: mapMutations(['setOrderDateFilter']),

  async mounted() {
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
    UiDateRange,
    GetSimOrderCreator,
  },
};
</script>

<style lang="scss">
.checkbox-container .checkmark {
  border: 1px solid $medium-gray;
}

.checkbox-container .checkmark.regular {
  &:after {
    border-color: $dark-gray;
  }
}
</style>
