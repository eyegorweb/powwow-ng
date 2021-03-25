<template>
  <div class="mt-0">
    <div class="row mb-0">
      <div class="col-md-9"></div>
      <div class="col-md-3">
        <permission domain="getSim" action="create">
          <UiButton variant="accent" block class="float-right" @click="openCreateOrderPanel()">
            {{ $t('getsim.order-sim') }}
          </UiButton>
        </permission>
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
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'GetSim',

  components: {
    UiButton,
    Tooltip,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
    UiTabs,
    UiTab,
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
        ignoreClickAway: true,
      });
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState({
      isPanelOpen: (state) => state.ui.isPanelOpen,
    }),
    ...mapGetters('getsim', ['appliedFilters']),
  },
  mounted() {
    // inspiration
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
    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>
