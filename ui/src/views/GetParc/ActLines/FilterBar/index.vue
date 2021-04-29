<template>
  <div class="card filter-bar">
    <div class="card-body" :class="[allFiltersVisible ? 'show-all-filters' : 'hide-all-filters']">
      <h5 class="card-title">{{ $t('filters.title') }}</h5>
      <SelectedFiltersManagement
        module-name="SIM"
        :current-filters="currentFilters"
        :fixed-filters="fixedFilters"
        :can-show-selected-filter="canShowSelectedFilter"
        @clear="(filterId) => clearFilter(filterId)"
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
            v-if="!userIsMVNO"
            :title="$t('filters.lines.profileEUICC')"
            :key="'el20'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLineProfileStateFilter />
          </FoldableBlock>
          <FoldableBlock
            v-if="!userIsMVNO"
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
            v-if="!userIsMVNO"
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
            v-if="!userIsMVNO"
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
          <FoldableBlock
            v-if="((userIsPartner || userIsGroupPartner) && ipFixeEnabled) || userIsBO"
            :title="$t('filters.lines.ipFixe')"
            :key="'el29'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <SimpleInputFilter
              :selected-value="selectedIPValue"
              @update:value="selectIPFilter($event)"
            />
          </FoldableBlock>
          <FoldableBlock
            v-if="userIsBO"
            :title="$t('filters.lines.terminationValidated')"
            :key="'el30'"
            :disabled="filtersAreDisabled"
            draggable
          >
            <ActLinesTerminationFilter
              :selected-value="selectedTerminationValue"
              @update:value="selectTerminationFilter($event)"
            />
          </FoldableBlock>
          <template v-if="userHaveEsimEnabled">
            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.id')"
              :key="'esim1'"
              :disabled="filtersAreDisabled"
              draggable
            >
              <SimpleInputFilter
                :selected-value="selectedEsimIdValue"
                @update:value="selectEsimIdFilter($event)"
              />
            </FoldableBlock>

            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.category')"
              :key="'esim2'"
              :disabled="filtersAreDisabled"
              draggable
            >
              <EsimCategoryFilter
                :selected-value="selectedEsimCategoryValue"
                @update:value="selectEsimCategoryFilter($event)"
              />
            </FoldableBlock>
            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.type')"
              :key="'esim3'"
              :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
              draggable
            >
              <TypeEsimFilter />
            </FoldableBlock>
            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.downloadStatus')"
              :key="'esim4'"
              :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
              draggable
            >
              <EsimDownloadStatusFilter />
            </FoldableBlock>
            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.pairedLine')"
              :key="'esim5'"
              :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
              draggable
            >
              <EsimPairedLine />
            </FoldableBlock>
            <FoldableBlock
              :title="$t('indicators.getparc.lines.esim.rid')"
              :key="'esim6'"
              :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
              draggable
            >
              <SimpleInputFilter
                :selected-value="selectedSmsRid"
                @update:value="selectSMSRidFilter($event)"
              />
            </FoldableBlock>
          </template>
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
import ActLinesTerminationFilter from './ActLinesTerminationFilter';
import TypeEsimFilter from '@/views/GetParc/ActLines/FilterBar/Esim/TypeEsimFilter.vue';
import EsimDownloadStatusFilter from '@/views/GetParc/ActLines/FilterBar/Esim/EsimDownloadStatusFilter.vue';
import EsimPairedLine from '@/views/GetParc/ActLines/FilterBar/Esim/EsimPairedLine.vue';

// import EsimFamilyFilter from '@/views/GetParc/ActLines/FilterBar/Esim/EsimFamilyFilter.vue'
import EsimCategoryFilter from '@/views/GetParc/ActLines/FilterBar/Esim/EsimCategoryFilter.vue';

import SelectedFiltersManagement from '@/components/Filters/SelectedFiltersManagement.vue';
import { getPartyOptions } from '@/api/partners.js';

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
    EsimCategoryFilter,
    TypeEsimFilter,
    EsimDownloadStatusFilter,
    EsimPairedLine,
    ActLinesTerminationFilter,
    // EsimFamilyFilter
  },
  data() {
    return {
      allFiltersVisible: false,
      ipFixeEnabled: false,
    };
  },
  computed: {
    ...mapState('actLines', ['actToCreate']),
    ...mapGetters([
      'userIsPartner',
      'userInfos',
      'userIsMVNO',
      'userIsBO',
      'userIsGroupPartner',
      'userHaveEsimEnabled',
    ]),
    ...mapGetters('actLines', [
      'currentFilters',
      'canShowSelectedFilter',
      'selectedOrderIdValue',
      'selectedOrderRefValue',
      'selectedPostalCodeValue',
      'selectedSirensValue',
      'selectedActionIDValue',
      'selectedIPValue',
      'selectedLigneTrafiquanteValue',
      'selectedICCIDValue',
      'selectedIMSIValue',
      'selectedMSISDNValue',
      'selectedIMEIValue',
      'selectedEsimIdValue',
      'selectedTerminationValue',
      'selectedEsimCategoryValue',
      'selectedSmsRid',
      // 'selectedEsimFamilyValue'
      // 'selectedIdTypeFromFileValue',
      // 'selectedFileValue',
    ]),

    isEsimCategoryInFilter() {
      return this.selectedEsimCategoryValue === 'eSim';
    },
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
  },
  mounted() {
    this.fetchPartnerOptions();
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
      'selectEsimIdFilter',
      'selectTerminationFilter',
      'selectIPFilter',
      'selectEsimCategoryFilter',
      'selectSMSRidFilter',
      // 'selectEsimFamilyFilter'
    ]),
    ...mapActions('actLines', ['clearFilter']),

    async fetchPartnerOptions() {
      const optionsPartner = await getPartyOptions(this.userInfos.id);
      this.ipFixeEnabled = optionsPartner.ipFixeEnable;
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
