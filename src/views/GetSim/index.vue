<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetSim</b>
          - {{ $t('getsim.manage-orders') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton
          variant="accent"
          block
          class="float-right"
          @click="
            openPanel({
              title: $t('getsim.order-sim'),
              panelId: 'getsim.order-sim',
              wide: true,
              backdrop: true,
            })
          "
          >{{ $t('getsim.order-sim') }}</UiButton
        >
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <GetSimIndicators />
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
import GetSimFilters from './FilterBar/GetSimFilters';
import GetSimIndicators from './GetSimIndicators';
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
  name: 'GetSim',

  components: {
    UiButton,
    GetSimOrders,
    GetSimFilters,
    GetSimIndicators,
  },

  methods: {
    ...mapActions('getsim', ['initFilterForPartnerUser']),
    ...mapMutations(['openPanel']),
  },
  computed: mapState({
    isPanelOpen: state => state.ui.isPanelOpen,
  }),

  mounted() {
    this.initFilterForPartnerUser();
  },
};
</script>
