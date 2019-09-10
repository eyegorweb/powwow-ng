<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetSim</b>
          - {{ $t('getsim.manage-orders') }}
          <Tooltip direction="right">{{ $t('getsim.tooltip-text') }}</Tooltip>
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="accent" block class="float-right" @click="openCreateOrderPanel()">
          {{ $t('getsim.order-sim') }}
        </UiButton>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <GetSimIndicators @click="setCurrentFiltersForIndicator" />
        <br />
        <GetSimFilters />
      </div>
      <div class="col-md-9">
        <GetSimOrders :key="$i18n.locale" :is-panel-open="isPanelOpen" />
      </div>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';
import GetSimOrders from './GetSimOrders';
import GetSimIndicators from './GetSimIndicators';
import GetSimFilters from './FilterBar/GetSimFilters';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'GetSim',

  components: {
    UiButton,
    Tooltip,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
  },

  methods: {
    ...mapActions('getsim', ['initFilterForContext']),
    ...mapMutations(['openPanel']),
    ...mapMutations('getsim', [
      'setCurrentFilters',
      'applyFilters',
      'setRouteParamsFilters',
      'setOpenDetailPanel',
    ]),

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },

    openCreateOrderPanel() {
      this.openPanel({
        title: this.$t('getsim.order-sim'),
        panelId: 'getsim.order-sim',
        wide: true,
        backdrop: true,
      });
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    ...mapState({
      isPanelOpen: state => state.ui.isPanelOpen,
    }),
    ...mapGetters('getsim', ['appliedFilters']),
  },
  mounted() {
    if (this.$route.params && this.$route.params.queryFilters) {
      this.setRouteParamsFilters(this.$route.params.queryFilters);
    }

    if (this.$route.params && this.$route.params.openDetailPanel) {
      this.setOpenDetailPanel(this.$route.params.openDetailPanel);
    }
    if (this.$route.params && this.$route.params.createOrder) {
      this.openCreateOrderPanel();
    }

    this.initFilterForContext();
  },
  watch: {
    contextPartnersTypes() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>
