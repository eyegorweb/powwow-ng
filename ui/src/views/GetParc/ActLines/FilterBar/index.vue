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
            v-if="!userIsPartner"
            :title="$t('filters.partners')"
            :key="'el1'"
            draggable
          >
            <ActLinesPartnersFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.billingAccounts')" :key="'el2'" draggable>
            <ActLinesBillingAccountsFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.fromFile')" :key="'el3'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.typeSIMCard')" :key="'el4'" draggable>
            <TypeSimCard />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.associatedOffer')" :key="'el5'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.orderID')" :key="'el6'" draggable>
            <SimpleInputFilter
              :selected-value="selectedOrderIdValue"
              @update:value="selectOrderIdFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderReference')" :key="'el7'" draggable>
            <SimpleInputFilter
              :selected-value="selectedOrderRefValue"
              @update:value="selectOrderRefFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.SIMCardStatus')" :key="'el8'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.commercialStatus')" :key="'el9'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.billingStatus')" :key="'el10'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.networkStatus')" :key="'el11'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderDate')" :key="'el12'" draggable> </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.importDate')" :key="'el13'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.endCommitmentDate')" :key="'el14'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.activationDate')" :key="'el15'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.preActivationDate')" :key="'el16'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.statusDate')" :key="'el17'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.country')" :key="'el18'" draggable> </FoldableBlock>
          <FoldableBlock :title="$t('filters.postalCode')" :key="'el19'" draggable>
            <SimpleInputFilter
              :selected-value="selectedPostalCodeValue"
              @update:value="selectPostalCodeFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.profileEUICC')" :key="'el20'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.customFileds')" :key="'el21'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeICCID')" :key="'el22'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeIMSI')" :key="'el23'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeMSISDN')" :key="'el24'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeIMEI')" :key="'el25'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.siren')" :key="'el26'" draggable>
            <SimpleInputFilter
              :selected-value="selectedSirensValue"
              @update:value="selectSirensFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('orders.detail.manageID')" :key="'el27'" draggable>
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.traffic')" :key="'el28'" draggable>
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
import FoldableBlock from '@/components/FoldableBlock';
import draggable from 'vuedraggable';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ActLinesPartnersFilter from './ActLinesPartnersFilter';
import ActLinesBillingAccountsFilter from './ActLinesBillingAccountsFilter';
import SelectedFilters from '@/components/Filters/SelectedFilters';
import TypeSimCard from './TypeSimCard';
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';

export default {
  components: {
    draggable,
    FoldableBlock,
    ActLinesPartnersFilter,
    SelectedFilters,
    ActLinesBillingAccountsFilter,
    TypeSimCard,
    SimpleInputFilter,
  },
  data() {
    return {
      allFiltersVisible: false,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapGetters('actLines', [
      'currentFilters',
      'canShowSelectedFilter',
      'selectedOrderIdValue',
      'selectedOrderRefValue',
      'selectedPostalCodeValue',
      'selectedSirensValue',
    ]),
  },
  methods: {
    ...mapMutations('actLines', [
      'applyFilters',
      'selectOrderIdFilter',
      'selectOrderRefFilter',
      'selectPostalCodeFilter',
      'selectSirensFilter',
    ]),
    ...mapActions('actLines', ['clearFilter']),

    showAllFilters() {
      this.allFiltersVisible = !this.allFiltersVisible;
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
