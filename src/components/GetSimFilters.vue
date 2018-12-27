<template>
  <div class="card filter-bar">
    <div class="card-body">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <!-- TODO: a voir si ces computed properties sont toujours d'actualité -->
      <SelectedFilters
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
          />
          <FoldableBlock
            :title="$t('filters.orderStatus')"
            :key="'el3'"
            draggable
          />
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
import SelectedFilters from '@/components/filters/selected/SelectedFilters';
import GetSimPartnersFilter from '@/components/GetSimPartnersFilter';

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
    };
  },

  components: {
    draggable,
    FoldableBlock,
    GetSimPartnersFilter,
    GetSimCustomFields,
    SelectedFilters,
  },
};
</script>

<style lang="scss" scoped>
</style>
