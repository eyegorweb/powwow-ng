<template>
  <div class="container">
    <NavBars is-backoffice-profile />
    <div class="mt-4">
      <div class="row mb-5">
        <div class="col-md-9">
          <h4><b>GetSim</b> - {{ $t("getsim.manage-orders") }} <i class="ic-Info-Icon" /></h4>
        </div>
        <div class="col-md-3">
          <UiButton
            variant="accent"
            block
            class="float-right"
            @click="isPanelOpen=true"
          > {{ $t("getsim.order-sim") }}</UiButton>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3">
          <GetSimIndicators />
          <br>
          <GetSimFilters />
        </div>
        <div class="col-md-9">
          <GetSimOrders :key="$i18n.locale" />
        </div>
      </div>
    </div>
    <GetSimCreateOrderPanel :is-open.sync="isPanelOpen" />
  </div>
</template>

<script>
import NavBars from '@/components/NavBars';
import UiButton from '@/components/ui/Button';
import GetSimOrders from './GetSimOrders';
import GetSimFilters from './GetSimFilters';
import GetSimIndicators from './GetSimIndicators';
import GetSimCreateOrderPanel from './CreateOrder/CreateOrderPanel';

export default {
  name: 'GetSim',
  data() {
    return {
      isPanelOpen: false,
    };
  },
  components: {
    NavBars,
    UiButton,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
    GetSimCreateOrderPanel,
  },
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
