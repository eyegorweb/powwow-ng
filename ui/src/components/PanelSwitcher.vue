<template>
  <SlidePanel
    :title="title"
    :title-conf="titleConf"
    :is-open="isOpen"
    @close="closePanel"
    :wide="wide"
    :width="width"
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
      <LineAlarmDetailPanel
        v-if="panelId === 'getparc.lineDetail.alarms.trigger-history'"
        :content="payload"
      />
      <TheAlarmDetailPanel v-if="panelId === 'getvsion.alarm-detail'" :content="payload" />
      <AlarmCreationPanel v-if="panelId === 'getvsion.table.create-alarm'" :content="payload" />
      <ReportCreationPanel v-if="panelId === 'getreport.create_report'" :content="payload" />
      <ImportSimCardsToOrderPanel
        v-if="panelId === 'getsim.actions.IMPORT_SIM'"
        :content="payload"
      />
    </div>
  </SlidePanel>
</template>

<script>
import SlidePanel from '@/components/SlidePanel';
import { mapState, mapMutations } from 'vuex';

export default {
  components: {
    SlidePanel,
    GetSimCreateOrderPanel: () => import('@/views/GetSim/CreateOrder/CreateOrderPanel'),
    GetSimOrderDetails: () => import('@/views/GetSim/GetSimOrderDetails'),
    GetSimCreatorDetails: () => import('@/views/GetSim/GetSimCreatorDetails'),
    ActHistoryDetailPanel: () => import('@/views/GetParc/MassActionsPage/ActHistoryDetailPanel'),
    ActLinesDetailPanel: () => import('@/views/GetParc/ActLines/ActLinesDetailPanel'),
    ActCreationPanel: () => import('@/views/GetParc/LineDetail/ActCreation/ActCreationPanel'),
    CustomizePanel: () => import('@/views/Home/CustomizePanel'),
    LineAlarmDetailPanel: () =>
      import('@/views/GetParc/LineDetail/DetailsTab/AlarmList/AlarmDetailPanel'),
    TheAlarmDetailPanel: () =>
      import('@/views/GetVision/alarms/ParcAlarmsTab/AlarmsTable/TheAlarmDetailPanel.vue'),
    AlarmCreationPanel: () => import('@/views/GetVision/AlarmCreationPanel'),
    ReportCreationPanel: () => import('@/views/GetReport/ReportCreationPanel'),
    ImportSimCardsToOrderPanel: () => import('@/views/GetSim/ImportSimCardsToOrderPanel.vue'),
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
    width: state => state.ui.width,
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
