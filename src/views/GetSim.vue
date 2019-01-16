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
          <UiButton variant="accent" block class="float-right">{{ $t("getsim.order-sim") }}</UiButton>
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
  </div>
</template>

<script>
import NavBars from '@/components/NavBars';
import UiButton from '@/components/ui/Button';
import GetSimOrders from '@/components/GetSimOrders';
import GetSimFilters from '@/components/GetSimFilters';
import GetSimIndicators from '@/components/GetSimIndicators';

export default {
  name: 'GetSim',
  components: {
    NavBars,
    UiButton,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
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
