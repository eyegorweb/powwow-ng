<template>
  <div class="mt-0">
    <div class="row mb-0">
      <div class="col-md-9"></div>
      <div class="col-md-3">
        <permission domain="getSim" action="create">
          <UiButton
            variant="accent"
            block
            class="float-right create-order"
            @click="openCreateOrderPanel()"
          >
            {{ $t('getsim.order-sim') }}
          </UiButton>
        </permission>
      </div>
    </div>

    <div class="row">
      <div class="col-md-3">
        <GetSimIndicators @click="setCurrentFiltersForIndicator" v-if=" !userIsByCustomerAccount"/>
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
import GetSimOrders from './GetSimOrders';
import GetSimIndicators from './GetSimIndicators';
import GetSimFilters from './FilterBar/GetSimFilters';
import { mapMutations, mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'GetSim',

  components: {
    UiButton,
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
      if (!this.isM2MLIGHTPartner) {
        this.openPanel({
          title: this.$t('getsim.order-sim'),
          panelId: 'getsim.order-sim',
          wide: true,
          backdrop: true,
          ignoreClickAway: true,
        });
      } else {
        this.openPanel({
          title: this.$t('getsim.order-sim'),
          panelId: 'getsim.public-order-sim',
          wide: true,
          backdrop: true,
          ignoreClickAway: true,
        });
      }
    },
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters(['userIsPartner', 'singlePartner', 'userIsByCustomerAccount']),
    ...mapState({
      isPanelOpen: (state) => state.ui.isPanelOpen,
    }),
    ...mapGetters('getsim', ['appliedFilters']),
    ...mapGetters(['userInfos']),
    isM2MLIGHTPartner() {
      if (!this.userInfos || !this.userInfos.partners) return;
      const found = this.userInfos.partners.find((r) => {
        return r.partyType === 'M2M_LIGHT';
      });
      return !!found;
    },
  },
  mounted() {
    // inspiration
    if (this.$route.params && this.$route.params.queryFilters) {
      this.setRouteParamsFilters(this.$route.params.queryFilters);
    }

    if (this.$route.params && this.$route.params.openDetailPanel) {
      this.setOpenDetailPanel(this.$route.params.openDetailPanel);
    }
    // Add route params create order for M2M Light partner
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
