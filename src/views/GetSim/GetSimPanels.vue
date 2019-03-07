<template>
  <SlidePanel :title="title" :is-open="isOpen" @close="closePanel" :wide="wide" :backdrop="backdrop">
    <div class="panel-container">
      <GetSimCreateOrderPanel v-if="panelId === 'getsim.order-sim'" />
      <GetSimOrderDetails v-if="panelId === 'getsim.details.title'" :order="payload" />
      <GetSimCreatorDetails v-if="panelId === 'getsim.creator.title'" :order="payload" />
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import { mapState, mapMutations } from 'vuex';

import GetSimCreateOrderPanel from './CreateOrder/CreateOrderPanel';
import GetSimOrderDetails from './GetSimOrderDetails';
import GetSimCreatorDetails from './GetSimCreatorDetails';

export default {
  components: {
    SlidePanel,
    GetSimCreateOrderPanel,
    GetSimOrderDetails,
    GetSimCreatorDetails,
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
    backdrop: state => state.ui.backdrop,
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
