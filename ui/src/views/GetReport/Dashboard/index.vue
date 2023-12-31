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
      <div class="filter-item-large">
        <BillingAccountAutocomplete
          :disabled="!selectedPartner"
          v-model="selectedBillingAccount"
          :selected-partner="selectedPartner"
          preselect-first-only-when-one-item
        />
      </div>
      <div class="filter-item">
        <OfferCombo
          v-model="selectedOffer"
          :partners="partnersForFilters"
          :disabled="!selectedPartner"
        />
      </div>
      <div class="action-btn pl-2">
        <UiButton variant="primary" @click="doFilter" :disabled="filtersKey === lastFiltersKey">
          {{ $t('filter') }}
        </UiButton>
      </div>
      <div class="action-btn pl-2">
        <UiButton v-if="canCancel" variant="danger" @click="revertSelection">{{
          $t('reset')
        }}</UiButton>
      </div>
    </div>

    <draggable handle=".handle">
      <transition-group>
        <div :key="'Consommation'">
          <permission domain="getReport" action="read_dashboard">
            <FoldableBlock default-open :title="'Consommation'" draggable>
              <div>
                <div class="row" v-if="!userIsM2MLight && !isUserByCF">
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
          </permission>
        </div>
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
        <div :key="'Parc'">
          <permission domain="getReport" action="read_dashboard">
            <FoldableBlock default-open :title="'Parc'" draggable>
              <div>
                <div class="row flexResponsive">
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
          </permission>
        </div>
        <FoldableBlock
          v-if="
            !userIsM2MLight &&
              !isUserByCF &&
              havePermission('getReport', 'read_dashboard') &&
              havePermission('alarm', 'read')
          "
          default-open
          :title="'Alarme'"
          :key="'Alarme'"
          draggable
        >
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
            <FoldableBlock default-open :title="'Facturation'" draggable v-if="!isUserByCF">
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
        (f) => f.id === 'filters.partners'
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
        (f) => f.id === 'filters.billingAccounts'
      );
      if (selectedBillingAccount) {
        this.selectedBillingAccount = {
          id: selectedBillingAccount.values[0].id,
          label: selectedBillingAccount.values[0].label,
          data: selectedBillingAccount.values[0].meta.customerAccount,
        };
      }

      const selectedOffer = this.$route.params.queryFilters.find((f) => f.id === 'filters.offers');
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
      lastFiltersKey: undefined,
    };
  },
  computed: {
    ...mapGetters([
      'userIsPartner',
      'singlePartner',
      'userIsM2MLight',
      'userIsByCustomerAccount',
      'havePermission',
    ]),
    isUserByCF() {
      return this.userIsByCustomerAccount;
    },

    canCancel() {
      return !!this.selectedPartner || !!(this.singlePartner && this.singlePartner.length);
    },
    filtersKey() {
      let partnerKey = 'none';
      let billingAccountKey = 'none';
      let offerKey = 'none';

      if (this.selectedPartner && this.selectedPartner.id) {
        partnerKey = this.selectedPartner.id;
      }

      if (this.selectedBillingAccount && this.selectedBillingAccount.id) {
        billingAccountKey = this.selectedBillingAccount.id;
      }

      if (this.selectedOffer && this.selectedOffer.id) {
        offerKey = this.selectedOffer.id;
      }

      return `${partnerKey}_${billingAccountKey}_${offerKey}`;
    },
  },
  watch: {
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
      const doSearch = () => {
        this.lastFiltersKey = this.filtersKey;
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
      };

      if (this.lastFiltersKey !== this.filtersKey) {
        this.appliedPartner = undefined;
        this.appliedBillingAccount = undefined;
        this.appliedOffer = undefined;

        setTimeout(() => {
          doSearch();
        });
      }
    },
    revertSelection() {
      this.selectedPartner = this.initialPartner;
      this.selectedBillingAccount = undefined;
      this.selectedOffer = undefined;
      this.lastFiltersKey = undefined;
      this.appliedPartner = undefined;
      this.appliedBillingAccount = undefined;
      this.appliedOffer = undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
.flexResponsive {
  @media screen and (max-width: 992px) {
    flex-direction: column;

    .col-4 {
      width: 100%;
      max-width: 100%;
    }
  }
}
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
