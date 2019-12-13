<template>
  <SlidePanel
    :title="title"
    :title-conf="titleConf"
    :is-open="isOpen"
    @close="closePanel"
    :wide="wide"
    :backdrop="backdrop"
    :ignore-click-away="ignoreClickAway"
  >
    <div class="panel-container">
      <GetSimCreateOrderPanel v-if="panelId === 'getsim.order-sim'" :order="payload" />
      <GetSimOrderDetails v-if="panelId === 'getsim.details.title'" :order="payload" />
      <GetSimCreatorDetails v-if="panelId === 'getsim.creator.title'" :order="payload" />
      <ActHistoryDetailPanel
        v-if="panelId === 'getparc.history.details.title'"
        :content="payload"
      />
      <ActLinesDetailPanel v-if="panelId === 'getparc.actLines.details.title'" :content="payload" />
      <ActCreationPanel
        v-if="panelId === 'getparc.actLines.details.createAct'"
        :content="payload"
      />
      <CustomizePanel v-if="panelId === 'home.customize.title'" :content="payload" />
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import { mapState, mapMutations } from 'vuex';

import GetSimCreateOrderPanel from '@/views/GetSim/CreateOrder/CreateOrderPanel';
import GetSimOrderDetails from '@/views/GetSim/GetSimOrderDetails';
import GetSimCreatorDetails from '@/views/GetSim/GetSimCreatorDetails';
import ActHistoryDetailPanel from '@/views/GetParc/MassActionsPage/ActHistoryDetailPanel';
import ActLinesDetailPanel from '@/views/GetParc/ActLines/ActLinesDetailPanel';
import ActCreationPanel from '@/views/GetParc/LineDetail/ActCreation/ActCreationPanel';
import CustomizePanel from '@/views/Home/CustomizePanel';

export default {
  components: {
    SlidePanel,
    GetSimCreateOrderPanel,
    GetSimOrderDetails,
    GetSimCreatorDetails,
    ActHistoryDetailPanel,
    ActLinesDetailPanel,
    ActCreationPanel,
    CustomizePanel,
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
    titleConf: state => state.ui.panelTitleConf,
    ignoreClickAway: state => state.ui.ignoreClickAway,
  }),
};
</script>

<style lang="scss" scoped>
.panel-container {
  height: 100%;
  margin: 0;
  padding-top: 3.7em;
  overflow: hidden;
  div {
    padding: 0;
  }
}
</style>
