<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('menu.reportsDashboard') }}
        </h4>
      </div>
    </div>
    <div class="filters-container">
      <div v-if="userIsBO" class="filter-item-large">
        <PartnerCombo :value.sync="selectedPartner" offline />
      </div>
      <div class="filter-item">
        <BillingAccountAutocomplete
          :disabled="!selectedPartner"
          v-model="selectedBillingAccount"
          :partners="partnersForFilters"
        />
      </div>
      <div class="filter-item">
        <OfferCombo
          :value.sync="selectedOffer"
          :partners="partnersForFilters"
          :disabled="!selectedPartner"
        />
      </div>
      <div class="action-btn pl-2">
        <UiButton variant="primary" @click="doFilter">Filtrer</UiButton>
      </div>
    </div>

    <draggable handle=".handle">
      <transition-group>
        <FoldableBlock default-open :title="'Consommation'" :key="'Consommation'" draggable>
          <div>
            <div class="row">
              <ReportGauges
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
            <div class="row">
              <ConsoHistoryGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
            <div class="row">
              <LocalisationGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Parc'" :key="'Parc'" draggable>
          <div>
            <div class="row">
              <ParcByOffersGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
              <LinesPerZoneGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
              <LinesByPLMNGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
            <div class="row">
              <ParcStateGraph />
            </div>
          </div>
        </FoldableBlock>
        <!--
        <FoldableBlock default-open :title="'Facturation'" :key="'Facturation'" draggable>
          <div>
            <div class="row">
              <BilledAmountsGraph />
            </div>
            <div class="row">
              <AmountByBilledLinesGraph />
            </div>
            <div class="row">
              <BilledAmountsByZone />
            </div>
            <div class="row">
              <BilledLinesNBGraph />
            </div>
            <div class="row">
              <BilledLinesByZone />
            </div>

            <div class="row">
              <LinesThreshold />
            </div>

            <div class="row">
              <ServicesGraph />
            </div>
          </div>
        </FoldableBlock>
        -->
        <FoldableBlock default-open :title="'Alarme'" :key="'Alarme'" draggable>
          <div>
            <div class="row">
              <AlarmsPerDayContainerGraph :partner="appliedPartner" />
            </div>
          </div>
        </FoldableBlock>
      </transition-group>
    </draggable>

    <hr />
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import PartnerCombo from '@/components/CustomComboxes/PartnerCombo.vue';
import BillingAccountAutocomplete from '@/components/CustomComboxes/BillingAccountAutocomplete.vue';
import OfferCombo from '@/components/CustomComboxes/OfferCombo.vue';
import FoldableBlock from '@/components/FoldableBlock';
import draggable from 'vuedraggable';
import ConsoHistoryGraph from './ConsoHistoryGraph';
import LocalisationGraph from './LocalisationGraph';
import ParcByOffersGraph from './ParcByOffersGraph';
import LinesPerZoneGraph from './LinesPerZoneGraph';
import LinesByPLMNGraph from './LinesByPLMNGraph';
import ParcStateGraph from './ParcStateGraph';
// import BilledAmountsGraph from './BilledAmountsGraph';
// import BilledAmountsByZone from './BilledAmountsByZone';
// import AmountByBilledLinesGraph from './AmountByBilledLinesGraph';
// import BilledLinesNBGraph from './BilledLinesNBGraph';
// import BilledLinesByZone from './BilledLinesByZone';
// import LinesThreshold from './LinesThreshold';
// import ServicesGraph from './ServicesGraph';
import AlarmsPerDayContainerGraph from './AlarmsPerDayContainerGraph';
import ReportGauges from './ReportGauges';

import { mapGetters } from 'vuex';

import { formatCurrency } from '@/utils/numbers.js';

export default {
  components: {
    UiButton,
    PartnerCombo,
    BillingAccountAutocomplete,
    OfferCombo,
    draggable,
    FoldableBlock,
    ConsoHistoryGraph,
    LocalisationGraph,
    ParcByOffersGraph,
    LinesPerZoneGraph,
    LinesByPLMNGraph,
    ParcStateGraph,
    // BilledAmountsGraph,
    // AmountByBilledLinesGraph,
    // BilledAmountsByZone,
    // BilledLinesNBGraph,
    // BilledLinesByZone,
    // LinesThreshold,
    // ServicesGraph,
    AlarmsPerDayContainerGraph,
    ReportGauges,
  },

  mounted() {
    if (this.singlePartner) {
      this.selectedPartner = {
        id: this.singlePartner.id,
        label: this.singlePartner.name,
        data: this.singlePartner,
      };

      this.appliedPartner = { ...this.selectedPartner };
    }
  },

  data() {
    return {
      selectedPartner: undefined,
      selectedBillingAccount: undefined,
      selectedOffer: undefined,
      partnersForFilters: undefined,

      appliedPartner: undefined,
      appliedBillingAccount: undefined,
      appliedOffer: undefined,
    };
  },
  computed: {
    ...mapGetters(['userIsBO', 'singlePartner']),
  },
  watch: {
    singlePartner() {
      console.log(this.singlePartner);
    },
    selectedPartner() {
      if (this.selectedPartner && this.selectedPartner.id) {
        this.partnersForFilters = [{ ...this.selectedPartner }];
      }
    },
  },

  methods: {
    formatCurrency(value) {
      return formatCurrency(value);
    },
    async doFilter() {
      if (this.selectedPartner) {
        this.appliedPartner = { ...this.selectedPartner };
      } else {
        this.appliedPartner = undefined;
      }

      if (this.selectedBillingAccount) {
        this.appliedBillingAccount = { ...this.selectedBillingAccount };
      } else {
        this.appliedBillingAccount = undefined;
      }

      if (this.selectedOffer) {
        this.appliedOffer = { ...this.selectedOffer };
      } else {
        this.appliedOffer = undefined;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.filters-container {
  display: flex;
  .filter-item {
    flex-basis: 15%;
  }

  .filter-item-large {
    flex-basis: 20%;
  }
}
</style>
