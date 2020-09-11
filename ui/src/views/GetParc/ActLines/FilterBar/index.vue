<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFiltersManagement
        module-name="SIM"
        :current-filters="currentFilters"
        :fixed-filters="fixedFilters"
        :can-show-selected-filter="canShowSelectedFilter"
        @clear="filterId => clearFilter(filterId)"
        @applyFilters="applyFilters"
        @chooseFilter="chooseFilter"
      />
      <draggable handle=".handle">
        <transition-group>
          <FoldableBlock
            v-if="!userIsPartner"
            :title="$t('filters.partners')"
            :key="'el1'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesPartnersFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.billingAccounts')"
            :key="'el2'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesBillingAccountsFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.fromFile.title')"
            :key="'el3'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesFromFileFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.typeSIMCard')"
            :key="'el4'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <TypeSimCard />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.associatedOffer')"
            :key="'el5'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesOffersFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.orderID')"
            :key="'el6'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedOrderIdValue"
              @update:value="selectOrderIdFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.orderReference')"
            :key="'el7'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedOrderRefValue"
              @update:value="selectOrderRefFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.SIMCardStatus')"
            :key="'el8'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesSimStatuses />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.commercialStatus')"
            :key="'el9'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesCommercialStatusFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.billingStatus')"
            :key="'el10'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesBillingStatusFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.networkStatus')"
            :key="'el11'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesNetworkStatusFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.orderDate')"
            :key="'el12'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.orderDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.importDate')"
            :key="'el13'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.importDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.endCommitmentDate')"
            :key="'el14'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.endCommitmentDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.activationDate')"
            :key="'el15'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.activationDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.preActivationDate')"
            :key="'el16'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.preActivationDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.statusDate')"
            :key="'el17'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <DateFilter
              ns="actLines"
              getter="selectedDate"
              setter="setDateFilter"
              filter-key="filters.lines.statusDate"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.country')"
            :key="'el18'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesCountries />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.postalCode')"
            :key="'el19'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedPostalCodeValue"
              @update:value="selectPostalCodeFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            v-if="!isUserMVNO"
            :title="$t('filters.lines.profileEUICC')"
            :key="'el20'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLineProfileStateFilter />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.customFileds')"
            :key="'el21'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesCustomFields />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.rangeICCID')"
            :key="'el22'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesRangeFilter
              :values="selectedICCIDValue"
              @update:values="selectICCIDFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.rangeIMSI')"
            :key="'el23'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesRangeFilter
              :values="selectedIMSIValue"
              @update:values="selectIMSIFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.rangeMSISDN')"
            :key="'el24'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesRangeFilter
              :values="selectedMSISDNValue"
              @update:values="selectMSISDNFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.rangeIMEI')"
            :key="'el25'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesRangeFilter
              :values="selectedIMEIValue"
              @update:values="selectIMEIFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.siren')"
            :key="'el26'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedSirensValue"
              @update:value="selectSirensFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('orders.detail.manageID')"
            :key="'el27'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedActionIDValue"
              @update:value="setActionIdFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            :title="$t('filters.lines.traffic')"
            :key="'el28'"
            :disabled="filtersAreDisabled"
            draggable
          >
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
import ActLinesFromFileFilter from './ActLinesFromFileFilter';
import DateFilter from '@/components/Filters/DateFilter';
import ActLinesRangeFilter from './ActLinesRangeFilter';

import SelectedFiltersManagement from '@/components/Filters/SelectedFiltersManagement.vue';

export default {
  components: {
    draggable,
    FoldableBlock,
    ActLinesPartnersFilter,
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
    ActLinesFromFileFilter,
    ActLinesRangeFilter,
    SelectedFiltersManagement,
  },
  data() {
    return {
      allFiltersVisible: false,
    };
  },
  computed: {
    ...mapState('actLines', ['actToCreate']),
    ...mapGetters(['userIsPartner', 'userInfos']),
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
      // 'selectedIdTypeFromFileValue',
      // 'selectedFileValue',
    ]),
    fixedFilters() {
      if (this.actToCreate) {
        return this.actToCreate.filters;
      }
      return [];
    },
    filtersAreDisabled() {
      return this.actToCreate && this.actToCreate.containFile;
    },
    ligneTrafiquanteValue: {
      get() {
        return this.selectedLigneTrafiquanteValue;
      },
      set(newValue) {
        this.setLligneTrafiquanteFilter(newValue);
      },
    },
    isUserMVNO() {
      if (!this.userInfos || !this.userInfos.roles) return;
      const found = this.userInfos.roles.find(r => {
        return r.description === 'MVNO';
      });
      return !!found;
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
      'setCurrentFilters',
    ]),
    ...mapActions('actLines', ['clearFilter']),

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
