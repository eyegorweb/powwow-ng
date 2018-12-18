<template>
  <div class="container">
    <NavBars is-backoffice-profile />
    <div class="mt-4">
      <div class="row mb-5">
        <div class="col-md-9">
          <h4><b>GetSim</b> - Gestion des commandes <i class="ic-Info-Icon" /></h4>
        </div>
        <div class="col-md-3">
          <UiButton
            variant="accent"
            block
            class="float-right"
          >Commander des cartes SIM</UiButton>
        </div>
      </div>
      <div class="row">
        <div class="col-md-9 offset-md-3">
          <GetSimOrders />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBars from '@/components/NavBars';
import UiButton from '@/components/ui/Button';
import GetSimOrders from '@/components/GetSimOrders';

export default {
  name: 'GetSim',
  components: {
    NavBars,
    UiButton,
    GetSimOrders,
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
