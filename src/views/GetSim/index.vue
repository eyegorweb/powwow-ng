<template>
  <div class="container">
    <NavBars is-backoffice-profile />
    <div class="mt-4">
      <div class="row mb-5">
        <div class="col-md-9">
          <h4>
            <b>GetSim</b>
            - {{ $t("getsim.manage-orders") }}
            <i class="ic-Info-Icon" />
          </h4>
        </div>
        <div class="col-md-3">
          <UiButton
            variant="accent"
            block
            class="float-right"
            @click="openPanel({title: $t('getsim.order-sim'), panelId: 'getsim.order-sim', wide: true})"
          >{{ $t("getsim.order-sim") }}</UiButton>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <GetSimIndicators />
          <br>
          <GetSimFilters />
        </div>
        <div class="col-md-9">
          <GetSimOrders :key="$i18n.locale" :is-panel-open="isPanelOpen" />
        </div>
      </div>
    </div>
    <GetSimPanels />
  </div>
</template>

<script>
import NavBars from '@/components/NavBars';
import UiButton from '@/components/ui/Button';
import GetSimOrders from './GetSimOrders';
import GetSimFilters from './GetSimFilters';
import GetSimIndicators from './GetSimIndicators';
import GetSimPanels from './GetSimPanels';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'GetSim',

  components: {
    NavBars,
    UiButton,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
    GetSimPanels,
  },

  methods: {
    ...mapMutations(['openPanel']),
  },
  computed: mapState({
    isPanelOpen: state => state.ui.isPanelOpen,
  }),
};
</script>

<style lang="scss" scoped>
h4 {
  font-weight: 400;
  line-height: 2rem;
  color: $dark-gray;
  i {
    color: $gray-400;
  }
}
</style>
