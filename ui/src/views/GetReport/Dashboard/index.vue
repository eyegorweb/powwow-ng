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
      <div v-if="!userIsPartner" class="filter-item-large">
        <PartnerCombo :value.sync="selectedPartner" />
      </div>
      <div class="filter-item">
        <BillingAccountAutocomplete
          :disabled="!selectedPartner"
          v-model="selectedBillingAccount"
          :partners="partnersForFilters"
          preselect-first
        />
      </div>
      <div class="filter-item">
        <OfferCombo
          :value.sync="selectedOffer"
          :partners="partnersForFilters"
          :disabled="!selectedPartner"
          preselect-first
        />
      </div>
      <div class="action-btn pl-2">
        <UiButton variant="primary" @click="doFilter">Filtrer</UiButton>
      </div>
      <div class="action-btn pl-2">
        <UiButton v-if="canCancel" variant="danger" @click="revertSelection">{{
          $t('reset')
        }}</UiButton>
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
              <ConsoHistoryGraphs
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
          </div>
        </FoldableBlock>
        <div :key="'Graphe monde'">
          <permission domain="getReport" action="read_dashboard_worldmap">
            <FoldableBlock default-open :title="'Graphe monde'" draggable>
              <div>
                <div class="row">
                  <LocalisationGraph
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
              </div>
            </FoldableBlock>
          </permission>
        </div>
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
            <permission domain="getReport" action="read_dashboard_fleet">
              <div class="row">
                <ParcStateGraph
                  :partner="appliedPartner"
                  :offer="appliedOffer"
                  :billing-account="appliedBillingAccount"
                />
              </div>
            </permission>
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Alarme'" :key="'Alarme'" draggable>
          <div>
            <div class="row">
              <AlarmsPerDayContainerGraph
                :partner="appliedPartner"
                :offer="appliedOffer"
                :billing-account="appliedBillingAccount"
              />
            </div>
          </div>
        </FoldableBlock>
        <div :key="'Facturation'">
          <permission domain="getReport" action="read_dashboard_billing">
            <FoldableBlock default-open :title="'Facturation'" draggable>
              <div>
                <div class="row">
                  <BilledAmountsGraph
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
                <div class="row">
                  <BilledAmountsByZone
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
                <div class="row">
                  <AmountByBilledLinesGraph
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>

                <div class="row">
                  <BilledLinesNBGraph
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
                <div class="row">
                  <BilledLinesByZone
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
                <div class="row">
                  <BilledServices
                    :partner="appliedPartner"
                    :offer="appliedOffer"
                    :billing-account="appliedBillingAccount"
                  />
                </div>
              </div>
            </FoldableBlock>
          </permission>
        </div>
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
import ConsoHistoryGraphs from './ConsoHistoryGraphs';
import LocalisationGraph from './LocalisationGraph';
import ParcByOffersGraph from './ParcByOffersGraph';
import LinesPerZoneGraph from './LinesPerZoneGraph';
import LinesByPLMNGraph from './LinesByPLMNGraph';
import ParcStateGraph from './ParcStateGraph';
import AlarmsPerDayContainerGraph from './AlarmsPerDayContainerGraph';
import ReportGauges from './ReportGauges';
import BilledAmountsGraph from './BilledAmountsGraph';
import BilledAmountsByZone from './BilledAmountsByZone';
import AmountByBilledLinesGraph from './AmountByBilledLinesGraph';
import BilledLinesNBGraph from './BilledLinesNBGraph';
import BilledLinesByZone from './BilledLinesByZone';
import BilledServices from './BilledServices';

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
    ConsoHistoryGraphs,
    LocalisationGraph,
    ParcByOffersGraph,
    LinesPerZoneGraph,
    LinesByPLMNGraph,
    ParcStateGraph,
    AlarmsPerDayContainerGraph,
    ReportGauges,
    BilledAmountsGraph,
    BilledAmountsByZone,
    AmountByBilledLinesGraph,
    BilledLinesNBGraph,
    BilledLinesByZone,
    BilledServices,
  },

  mounted() {
    if (this.singlePartner) {
      this.selectedPartner = {
        id: this.singlePartner.id,
        label: this.singlePartner.name,
        data: this.singlePartner,
      };
      this.initialPartner = this.selectedPartner;

      this.appliedPartner = { ...this.selectedPartner };
    }
    if (this.$route.params && this.$route.params.queryFilters) {
      const selectedPartner = this.$route.params.queryFilters.find(
        f => f.id === 'filters.partners'
      );
      if (selectedPartner) {
        this.selectedPartner = {
          id: selectedPartner.values[0].id,
          label: selectedPartner.values[0].label,
          data: selectedPartner.values[0],
        };
        this.initialPartner = this.selectedPartner;

        this.appliedPartner = { ...this.selectedPartner };
      }

      const selectedBillingAccount = this.$route.params.queryFilters.find(
        f => f.id === 'filters.billingAccounts'
      );
      if (selectedBillingAccount) {
        this.selectedBillingAccount = {
          id: selectedBillingAccount.values[0].id,
          label: selectedBillingAccount.values[0].label,
          data: selectedBillingAccount.values[0].meta.customerAccount,
        };
      }

      const selectedOffer = this.$route.params.queryFilters.find(f => f.id === 'filters.offers');
      if (selectedOffer) {
        this.selectedOffer = {
          id: selectedOffer.values[0].id,
          label: selectedOffer.values[0].label,
          data: selectedOffer.values[0].meta.workflow,
        };
      }
    }
  },

  data() {
    return {
      initialPartner: undefined,
      selectedPartner: undefined,
      selectedBillingAccount: undefined,
      selectedOffer: undefined,
      partnersForFilters: undefined,

      appliedPartner: undefined,
      appliedBillingAccount: undefined,
      appliedOffer: undefined,
      initialSearchDone: false,
    };
  },
  computed: {
    ...mapGetters(['userIsPartner', 'singlePartner']),
    canCancel() {
      return !!this.selectedPartner || !!(this.singlePartner && this.singlePartner.length);
    },
  },
  watch: {
    singlePartner() {
      console.log(this.singlePartner);
    },
    selectedPartner() {
      if (this.selectedPartner && this.selectedPartner.id) {
        this.partnersForFilters = [{ ...this.selectedPartner }];
        this.selectedOffer = undefined;
        this.selectedBillingAccount = undefined;
      }
    },
    selectedBillingAccount() {
      this.initialSearchWhenNecessary();
    },
    selectedOffer() {
      this.initialSearchWhenNecessary();
    },
  },

  methods: {
    initialSearchWhenNecessary() {
      if (!this.userIsPartner && this.initialSearchDone) return;
      if (this.selectedBillingAccount && this.selectedOffer) {
        this.initialSearchDone = true;

        this.doFilter();
      }
    },
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
    revertSelection() {
      this.selectedPartner = this.initialPartner;
      this.appliedPartner = undefined;
      this.appliedBillingAccount = undefined;
      this.appliedOffer = undefined;
      this.selectedBillingAccount = undefined;
      this.selectedOffer = undefined;
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
