<template>
  <div>
    <FoldableBlock
      v-if="!userIsPartner && keyName === 'el1'"
      :title="$t('filters.partners')"
      :key="'el1'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesPartnersFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el2'"
      :title="$t('filters.billingAccounts')"
      :key="'el2'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesBillingAccountsFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el3'"
      :title="$t('filters.lines.fromFile.title')"
      :key="'el3'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesFromFileFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el4'"
      :title="$t('filters.lines.typeSIMCard')"
      :key="'el4'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <TypeSimCard />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el5'"
      :title="$t('filters.lines.associatedOffer')"
      :key="'el5'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesOffersFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el6'"
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
      v-if="keyName === 'el7'"
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
      v-if="keyName === 'el8'"
      :title="$t('filters.lines.SIMCardStatus')"
      :key="'el8'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesSimStatuses />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el9'"
      :title="$t('filters.lines.commercialStatus')"
      :key="'el9'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesCommercialStatusFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el10'"
      :title="$t('filters.lines.billingStatus')"
      :key="'el10'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesBillingStatusFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el11'"
      :title="$t('filters.lines.networkStatus')"
      :key="'el11'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesNetworkStatusFilter />
    </FoldableBlock>

    <FoldableBlock
      v-if="keyName === 'el12'"
      :title="$t('filters.lines.community')"
      :key="'el12'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesCommunityFilter />
    </FoldableBlock>

    <FoldableBlock
      v-if="keyName === 'el13'"
      :title="$t('filters.orderDate')"
      :key="'el13'"
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
      v-if="keyName === 'el14'"
      :title="$t('filters.lines.importDate')"
      :key="'el14'"
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
      v-if="keyName === 'el15'"
      :title="$t('filters.lines.endCommitmentDate')"
      :key="'el15'"
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
      v-if="keyName === 'el16'"
      :title="$t('filters.lines.activationDate')"
      :key="'el16'"
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
      v-if="keyName === 'el17'"
      :title="$t('filters.lines.preActivationDate')"
      :key="'el17'"
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
      v-if="keyName === 'el18'"
      :title="$t('filters.lines.statusDate')"
      :key="'el18'"
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
      v-if="keyName === 'el19'"
      :title="$t('filters.country')"
      :key="'el19'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesCountries />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el20'"
      :title="$t('filters.postalCode')"
      :key="'el20'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <SimpleInputFilter
        :selected-value="selectedPostalCodeValue"
        @update:value="selectPostalCodeFilter($event)"
      />
    </FoldableBlock>
    <FoldableBlock
      v-if="
        !userIsMVNO &&
          (havePermission('getParc', 'manage_esim') ||
            havePermission('getParc', 'manage_esim_light')) &&
          keyName === 'el21'
      "
      :title="$t('filters.lines.profileEUICC')"
      :key="'el21'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLineProfileStateFilter />
    </FoldableBlock>
    <FoldableBlock
      v-if="!userIsMVNO && keyName === 'el22'"
      :title="$t('filters.lines.customFileds')"
      :key="'el22'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesCustomFields />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el23'"
      :title="$t('filters.lines.rangeICCID')"
      :key="'el23'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesRangeFilter
        :values="selectedICCIDValue"
        @update:values="selectICCIDFilter($event)"
      />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el24'"
      :title="$t('filters.lines.rangeIMSI')"
      :key="'el24'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesRangeFilter :values="selectedIMSIValue" @update:values="selectIMSIFilter($event)" />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el25'"
      :title="$t('filters.lines.rangeMSISDN')"
      :key="'el25'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesRangeFilter
        :values="selectedMSISDNValue"
        @update:values="selectMSISDNFilter($event)"
      />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el26'"
      :title="$t('filters.lines.rangeIMEI')"
      :key="'el26'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <ActLinesRangeFilter :values="selectedIMEIValue" @update:values="selectIMEIFilter($event)" />
    </FoldableBlock>
    <FoldableBlock
      v-if="!userIsMVNO && (userIsMultiCustomer || userIsOperator) && keyName === 'el27'"
      :title="$t('filters.lines.siren')"
      :key="'el27'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <SimpleInputFilter
        :selected-value="selectedSirensValue"
        @update:value="selectSirensFilter($event)"
      />
    </FoldableBlock>
    <FoldableBlock
      v-if="keyName === 'el28'"
      :title="$t('orders.detail.manageID')"
      :key="'el28'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <SimpleInputFilter
        :selected-value="selectedActionIDValue"
        @update:value="setActionIdFilter($event)"
      />
    </FoldableBlock>
    <FoldableBlock
      v-if="!userIsMVNO && keyName === 'el29'"
      :title="$t('filters.lines.traffic')"
      :key="'el29'"
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
      v-if="
        (((userIsPartner || userIsGroupPartner) && hasOptionIpFixe) || userIsBO) &&
          keyName === 'el30'
      "
      :title="$t('filters.lines.ipFixe')"
      :key="'el30'"
      :disabled="filtersAreDisabled"
      draggable
    >
      <SimpleInputFilter :selected-value="selectedIPValue" @update:value="selectIPFilter($event)" />
    </FoldableBlock>
    <FoldableBlock
      v-if="userIsBO && keyName === 'el31'"
      :title="$t('filters.lines.terminationValidated')"
      :key="'el31'"
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
        v-if="keyName === 'esim1'"
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
        v-if="keyName === 'esim2'"
        :title="$t('indicators.getparc.lines.esim.id')"
        :key="'esim1'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <SimpleInputFilter
          :selected-value="selectedEsimIdValue"
          @update:value="selectEsimIdFilter($event)"
        />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'esim3'"
        :title="$t('indicators.getparc.lines.esim.type')"
        :key="'esim3'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <TypeEsimFilter />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'esim4'"
        :title="$t('indicators.getparc.lines.esim.downloadStatus')"
        :key="'esim4'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <EsimDownloadStatusFilter />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'downloadedProfile'"
        :title="$t('filters.downloadedProfile')"
        :key="'downloadedProfile'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <DownloadProfileFilter />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'esim5'"
        :title="$t('indicators.getparc.lines.esim.pairedLine')"
        :key="'esim5'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <EsimPairedLine />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'esim6'"
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
      <FoldableBlock
        :title="$t('indicators.getparc.lines.esim.family')"
        :key="'esim7'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
        v-if="havePermission('getParc', 'manage_esim') && keyName === 'esim7'"
      >
        <EsimFamilyFilter
          :selected-value="selectedSmsRid"
          @update:value="selectEsimFamilyFilter($event)"
        />
      </FoldableBlock>
      <FoldableBlock
        v-if="keyName === 'esim8'"
        :title="$t('filters.lines.rangeEID')"
        :key="'esim8'"
        :disabled="filtersAreDisabled || !isEsimCategoryInFilter"
        draggable
      >
        <ActLinesRangeFilter :values="selectedEIDValue" @update:values="selectEIDFilter($event)" />
      </FoldableBlock>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

import FoldableBlock from '@/components/FoldableBlock';
import ActLinesPartnersFilter from './ActLinesPartnersFilter';
import ActLinesBillingAccountsFilter from './ActLinesBillingAccountsFilter';
import TypeSimCard from './TypeSimCard';
import SimpleInputFilter from '@/components/Filters/SimpleInputFilter';
import ActLinesOffersFilter from './ActLinesOffersFilter';
import ActLineProfileStateFilter from './ActLineProfileStateFilter';
import ActLinesSimStatuses from './ActLinesSimStatuses';
import ActLinesBillingStatusFilter from './ActLinesBillingStatusFilter';
import ActLinesNetworkStatusFilter from './ActLinesNetworkStatusFilter';
import ActLinesCommunityFilter from './ActLinesCommunityFilter';
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
import DownloadProfileFilter from '@/views/GetParc/ActLines/FilterBar/DownloadProfileFilter.vue';
import EsimCategoryFilter from '@/views/GetParc/ActLines/FilterBar/Esim/EsimCategoryFilter.vue';
import EsimFamilyFilter from '@/views/GetParc/ActLines/FilterBar/Esim/EsimFamilyFilter.vue';

import { isFeatureAvailable } from '@/api/partners';

export default {
  props: {
    keyName: {
      type: String,
      default: undefined,
    },
  },
  components: {
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
    ActLinesCommunityFilter,
    UiCheckbox,
    DateFilter,
    ActLinesCountries,
    ActLinesCustomFields,
    ActLinesCommercialStatusFilter,
    ActLinesFromFileFilter,
    ActLinesRangeFilter,
    EsimCategoryFilter,
    TypeEsimFilter,
    EsimDownloadStatusFilter,
    EsimPairedLine,
    ActLinesTerminationFilter,
    DownloadProfileFilter,
    EsimFamilyFilter,
  },
  computed: {
    ...mapState('actLines', ['actToCreate']),
    ...mapGetters('actLines', [
      'currentFilters',
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
      'selectedEIDValue',
      'selectedEsimIdValue',
      'selectedTerminationValue',
      'selectedEsimCategoryValue',
      'selectedSmsRid',
      'selectedCommunityValues',
      // 'selectedEsimFamilyValue'
      // 'selectedIdTypeFromFileValue',
      // 'selectedFileValue',
    ]),
    ...mapGetters([
      'userIsPartner',
      'userIsMVNO',
      'userIsBO',
      'userIsGroupPartner',
      'userHaveEsimEnabled',
      'havePermission',
      'userIsMultiCustomer',
      'userIsOperator',
      'userInfos',
    ]),
    filtersAreDisabled() {
      return this.actToCreate && this.actToCreate.containFile;
    },
    isEsimCategoryInFilter() {
      return this.selectedEsimCategoryValue === 'eSim';
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
  data() {
    return {
      hasOptionIpFixe: false,
    };
  },
  async mounted() {
    // Check for IPFixe filter
    if (this.keyName === 'el30') {
      this.hasOptionIpFixe = await isFeatureAvailable('IP_FIXE_ENABLED');
    }
  },
  methods: {
    ...mapMutations('actLines', [
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
      'selectEIDFilter',
      'selectEsimIdFilter',
      'selectTerminationFilter',
      'selectIPFilter',
      'selectEsimCategoryFilter',
      'selectSMSRidFilter',
      'selectEsimFamilyFilter',
    ]),
  },
};
</script>

<style></style>
