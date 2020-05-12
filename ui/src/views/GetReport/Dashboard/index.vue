<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetReport</b>
          - {{ $t('menu.reportsDashboard') }}
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="primary" block class="float-right">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getreport.create_report') }}
        </UiButton>
      </div>
    </div>
    <div class="filters-container">
      <div v-if="userIsBO" class="filter-item">
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
          <div class="d-flex">
            <ConsoHistoryGraph />
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Parc'" :key="'Parc'" draggable>
          <div>
            <LocalisationGraph />
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Facturation'" :key="'Facturation'" draggable>
          <div>
            TEST TEST
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Commande'" :key="'Commande'" draggable>
          <div>
            TEST TEST
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Alarme'" :key="'Alarme'" draggable>
          <div>
            TEST TEST
          </div>
        </FoldableBlock>
        <FoldableBlock default-open :title="'Etat des services'" :key="'service_state'" draggable>
          <div>
            TEST TEST
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
import { mapGetters } from 'vuex';

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
  },

  mounted() {
    if (this.singlePartner) {
      this.selectedPartner = {
        id: this.singlePartner.id,
        label: this.singlePartner.name,
        data: this.singlePartner,
      };
    }
  },

  data() {
    return {
      selectedPartner: undefined,
      selectedBillingAccount: undefined,
      selectedOffer: undefined,
      partnersForFilters: undefined,
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
    async doFilter() {
      console.log(this.selectedPartner, this.selectedBillingAccount, this.selectedOffer);
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
}
</style>
