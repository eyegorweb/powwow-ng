<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFilters
        v-if="canShowSelectedFilter"
        :current-filters="currentFilters"
        :fixed-filters="fixedFilters"
        @applyFilters="applyFilters"
        @clear="filterId => clearFilter(filterId)"
      />
      <draggable handle=".handle">
        <transition-group>
          <FoldableBlock :title="$t('filters.lines.SIMCardStatus')" :key="'el8'" draggable>
            <ActLinesSimStatuses />
          </FoldableBlock>
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
            <ActLinesOffersFilter />
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

          <FoldableBlock :title="$t('filters.lines.commercialStatus')" :key="'el9'" draggable>
            <ActLinesCommercialStatusFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.billingStatus')" :key="'el10'" draggable>
            <ActLinesBillingStatusFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.networkStatus')" :key="'el11'" draggable>
            <ActLinesNetworkStatusFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.orderDate')" :key="'el12'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.orderDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.importDate')" :key="'el13'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.importDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.endCommitmentDate')" :key="'el14'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.endCommitmentDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.activationDate')" :key="'el15'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.activationDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.preActivationDate')" :key="'el16'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.preActivationDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.statusDate')" :key="'el17'" draggable>
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.statusDate"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.country')" :key="'el18'" draggable>
            <ActLinesCountries />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.postalCode')" :key="'el19'" draggable>
            <SimpleInputFilter
              :selected-value="selectedPostalCodeValue"
              @update:value="selectPostalCodeFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.profileEUICC')" :key="'el20'" draggable>
            <ActLineProfileStateFilter />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.customFileds')" :key="'el21'" draggable>
            <ActLinesCustomFields />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeICCID')" :key="'el22'" draggable>
            <SimpleInputFilter
              :selected-value="selectedICCIDValue"
              @update:value="selectICCIDFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeIMSI')" :key="'el23'" draggable>
            <SimpleInputFilter
              :selected-value="selectedIMSIValue"
              @update:value="selectIMSIFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeMSISDN')" :key="'el24'" draggable>
            <SimpleInputFilter
              :selected-value="selectedMSISDNValue"
              @update:value="selectMSISDNFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.rangeIMEI')" :key="'el25'" draggable>
            <SimpleInputFilter
              :selected-value="selectedIMEIValue"
              @update:value="selectIMEIFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.siren')" :key="'el26'" draggable>
            <SimpleInputFilter
              :selected-value="selectedSirensValue"
              @update:value="selectSirensFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('orders.detail.manageID')" :key="'el27'" draggable>
            <SimpleInputFilter
              :selected-value="selectedActionIDValue"
              @update:value="setActionIdFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock :title="$t('filters.lines.traffic')" :key="'el28'" draggable>
            <UiCheckbox
              :value="{
                id: 'lineTrafficState',
                label: $t(`common.true`),
              }"
              v-model="ligneTrafiquanteValue"
              >{{ $t('filters.lines.trafficLabel') }}</UiCheckbox
            >
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
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ActLinesPartnersFilter from './ActLinesPartnersFilter';
import ActLinesBillingAccountsFilter from './ActLinesBillingAccountsFilter';
import SelectedFilters from '@/components/Filters/SelectedFilters';
import TypeSimCard from './TypeSimCard';
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';
import ActLinesOffersFilter from './ActLinesOffersFilter';
import ActLineProfileStateFilter from './ActLineProfileStateFilter';
import ActLinesSimStatuses from './ActLinesSimStatuses';
import ActLinesBillingStatusFilter from './ActLinesBillingStatusFilter';
import ActLinesNetworkStatusFilter from './ActLinesNetworkStatusFilter';
import UiCheckbox from '@/components/ui/Checkbox';
import ActLinesCountries from './ActLinesCountries';
import ActLinesCustomFields from './ActLinesCustomFields';
import ActLinesCommercialStatusFilter from './ActLinesCommercialStatusFilter';
import DateFilter from '@/components/Filters/DateFilter';

export default {
  components: {
    draggable,
    FoldableBlock,
    ActLinesPartnersFilter,
    SelectedFilters,
    ActLinesBillingAccountsFilter,
    TypeSimCard,
    SimpleInputFilter,
    ActLinesOffersFilter,
    ActLineProfileStateFilter,
    ActLinesSimStatuses,
    ActLinesBillingStatusFilter,
    ActLinesNetworkStatusFilter,
    UiCheckbox,
    DateFilter,
    ActLinesCountries,
    ActLinesCustomFields,
    ActLinesCommercialStatusFilter,
  },
  data() {
    return {
      allFiltersVisible: false,
    };
  },
  computed: {
    ...mapState('actLines', ['actToCreate']),
    ...mapGetters(['userIsPartner']),
    ...mapGetters('actLines', [
      'currentFilters',
      'canShowSelectedFilter',
      'selectedOrderIdValue',
      'selectedOrderRefValue',
      'selectedPostalCodeValue',
      'selectedSirensValue',
      'selectedActionIDValue',
      'selectedLigneTrafiquanteValue',
      'selectedICCIDValue',
      'selectedIMSIValue',
      'selectedMSISDNValue',
      'selectedIMEIValue',
    ]),
    fixedFilters() {
      if (this.actToCreate) {
        return this.actToCreate.filters;
      }
      return [];
    },
    ligneTrafiquanteValue: {
      get() {
        return this.selectedLigneTrafiquanteValue;
      },
      set(newValue) {
        this.setLligneTrafiquanteFilter(newValue);
      },
    },
  },
  methods: {
    ...mapMutations('actLines', [
      'applyFilters',
      'selectOrderIdFilter',
      'selectOrderRefFilter',
      'selectPostalCodeFilter',
      'selectSirensFilter',
      'setActionIdFilter',
      'setLligneTrafiquanteFilter',
      'selectICCIDFilter',
      'selectIMSIFilter',
      'selectMSISDNFilter',
      'selectIMEIFilter',
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
