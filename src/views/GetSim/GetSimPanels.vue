<template>
  <SlidePanel :title="title" :is-open="isOpen" @close="closePanel" :wide="wide">
    <div class="panel-container">
      <GetSimCreateOrderPanel v-if="panelId === 'getsim.order-sim'" />
      <OrderDetails v-if="panelId === 'getsim.details.title'" :order="payload" />
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import { mapState, mapMutations } from 'vuex';

import GetSimCreateOrderPanel from './CreateOrder/CreateOrderPanel';
import OrderDetails from './OrderDetails';

export default {
  components: {
    SlidePanel,
    GetSimCreateOrderPanel,
    OrderDetails,
  },
  methods: {
    ...mapMutations(['closePanel']),
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
    title: state => state.ui.panelTitle,
    panelId: state => state.ui.panelId,
    wide: state => state.ui.isPanelWide,
    payload: state => state.ui.panelPayload,
  }),
};
</script>

<style lang="scss" scoped>
.panel-container {
  height: 100%;
  margin: 0;
  padding-top: 57px;
  overflow: hidden;
  div {
    padding: 0;
  }
}
</style>
