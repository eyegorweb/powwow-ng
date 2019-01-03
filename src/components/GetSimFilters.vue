<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <!-- TODO: a voir si ces computed properties sont toujours d'actualité -->
      <GetSimSelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
      />
      <draggable>
        <transition-group>
          <FoldableBlock
            :title="$t('filters.partners')"
            :key="'el1'"
            draggable
          >
            <GetSimPartnersFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.billingAccounts')"
            :key="'el2'"
            draggable
          >
            <GetSimPartnersBillingAccountsFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.orderStatus')"
            :key="'el3'"
            draggable
          >
            <div>
              <UiCheckbox
                v-for="status in statusResults"
                :checked="status.checked"
                :value="status.label"
                :key="status.id"
              >{{ status.label }}</UiCheckbox>
            </div>
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.orderReference')"
            :key="'el4'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.orderDate')"
            :key="'el5'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.offer')"
            :key="'el6'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.quantity')"
            :key="'el7'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.customFields')"
            :key="'el8'"
            draggable
          >
            <GetSimCustomFields :fields="configAccount" />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.orderCreator')"
            :key="'el9'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.active')"
            :key="'el10'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.deliveryCountry')"
            :key="'el11'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.postalCode')"
            :key="'el12'"
            draggable
          />
          <FoldableBlock
            :title="$t('filters.city')"
            :key="'el13'"
            draggable
          />
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import FoldableBlock from '@/components/FoldableBlock';
import GetSimCustomFields from '@/components/GetSimCustomFields';
import GetSimSelectedFilters from '@/components/GetSimSelectedFilters';
import GetSimPartnersFilter from '@/components/GetSimPartnersFilter';
import UiCheckbox from '@/components/ui/Checkbox';
import { fetchOrderStatuses } from '@/api/orderStatuses';
import GetSimPartnersBillingAccountsFilter from '@/components/GetSimPartnersBillingAccountsFilter';

export default {
  computed: {
    ...mapGetters(['currentFilters', 'canShowSelectedFilter']),
  },
  data() {
    const configAccount = [
      {
        type: 'input',
      },
      {
        type: 'multichoices',
        values: [
          {
            code: 'c1',
            value: 'Partenaire 1',
            label: 'Partenaire 1',
          },
          {
            code: 'c2',
            value: 'Partenaire 2',
            label: 'Partenaire 2',
          },
          {
            code: 'c3',
            value: 'Partenaire 3',
            label: 'Partenaire 3',
          },
        ],
      },
      {
        type: 'date',
      },
    ];
    const selectedValuesForMultiChoice = [];
    return {
      configAccount,
      selectedValuesForMultiChoice,
      statusResults: [],
    };
  },

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
    UiCheckbox,
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
