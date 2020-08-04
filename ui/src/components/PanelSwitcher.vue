<template>
  <SlidePanel
    :title="title"
    :title-conf="titleConf"
    :is-open="isOpen"
    @close="closePanel"
    :wide="wide"
    :width="effectiveWidth"
    :backdrop="backdrop"
    :ignore-click-away="ignoreClickAway"
  >
    <div class="panel-container">
      <GetSimCreateOrderPanel v-if="panelId === 'getsim.order-sim'" :order="payload" />
      <GetSimOrderDetails v-if="panelId === 'getsim.details.title'" :order="payload" />
      <GetSimCreatorDetails v-if="panelId === 'getsim.creator.title'" :order="payload" />
      <GetParcCreatorDetails v-if="panelId === 'getparc.creator.title'" :order="payload" />
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
      <ActLinesImportSimCards v-if="panelId === 'getparc.lines-sim-import'" :content="payload" />
      <AdminFormPanel
        v-if="panelId === 'getadmin.partnerDetail.adminForm.title'"
        :content="payload"
      />
      <UserFormPanel
        v-if="panelId === 'getadmin.partnerDetail.userForm.title'"
        :content="payload"
      />
      <ChangeUserPasswordPanel
        v-if="panelId === 'getadmin.partnerDetail.changePassword.title'"
        :content="payload"
      />
      <BroadcastListFormPanel v-if="panelId === 'getadmin.customize.addList'" :content="payload" />
      <CustomFieldFormPanel
        v-if="panelId === 'getadmin.customize.addCustomField'"
        :content="payload"
      />
      <SpecificFieldFormPanel
        v-if="panelId === 'getadmin.customize.specificFields'"
        :content="payload"
      />
      <PartnerOfferPanel
        v-if="panelId === 'getadmin.partnerDetail.offerFromPanel.title'"
        :content="payload"
      />
      <DeliveryAddressFormPanel
        v-if="panelId === 'getadmin.customize.addDeliveryAddress'"
        :content="payload"
      />
      <BillDetailPanel v-if="panelId === 'bills.detailPanel'" :content="payload" />
      <CoachPanel
        v-if="panelId === 'coach.title'"
        :content="payload"
        @setWidth="overridenWidth = $event"
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
    GetParcCreatorDetails: () =>
      import('@/views/GetParc/MassActionsPage/HistoryTable/GetParcCreatorDetails'),
    ActHistoryDetailPanel: () => import('@/views/GetParc/MassActionsPage/ActHistoryDetailPanel'),
    ActLinesDetailPanel: () => import('@/views/GetParc/ActLines/ActLinesDetailPanel'),
    ActCreationPanel: () => import('@/views/GetParc/LineDetail/ActCreation/ActCreationPanel'),
    CustomizePanel: () => import('@/views/Home/CustomizePanel'),
    LineAlarmDetailPanel: () =>
      import('@/views/GetParc/LineDetail/DetailsTab/AlarmList/AlarmDetailPanel'),
    TheAlarmDetailPanel: () =>
      import('@/views/GetVision/alarms/ParcAlarmsTab/AlarmsTable/TheAlarmDetailPanel.vue'),
    AlarmCreationPanel: () => import('@/views/GetVision/AlarmCreationPanel'),
    ReportCreationPanel: () => import('@/views/GetReport/reports/ReportCreationPanel.vue'),
    ImportSimCardsToOrderPanel: () => import('@/views/GetSim/ImportSimCardsToOrderPanel.vue'),
    ActLinesImportSimCards: () => import('@/views/GetParc/ActLines/ActLinesImportSimCards.vue'),
    AdminFormPanel: () => import('@/views/GetAdmin/PartnerDetail/UsersTab/AdminFormPanel.vue'),
    UserFormPanel: () => import('@/views/GetAdmin/PartnerDetail/UsersTab/UserFormPanel.vue'),
    ChangeUserPasswordPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/UsersTab/ChangeUserPasswordPanel.vue'),
    PartnerOfferPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/OffersTab/PartnerOfferPanel.vue'),
    BroadcastListFormPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/CustomizeTab/BroadcastListFormPanel.vue'),
    CustomFieldFormPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/CustomizeTab/CustomFieldFormPanel.vue'),
    SpecificFieldFormPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/CustomizeTab/SpecificFieldFormPanel.vue'),
    DeliveryAddressFormPanel: () =>
      import('@/views/GetAdmin/PartnerDetail/CustomizeTab/DeliveryAddressFormPanel.vue'),
    BillDetailPanel: () => import('@/views/GetReport/Bill/BillDetailPanel.vue'),
    CoachPanel: () => import('@/views/GetParc/CoachM2M/CoachPanel.vue'),
  },
  methods: {
    ...mapMutations(['closePanel']),
  },
  computed: {
    ...mapState({
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

    effectiveWidth() {
      if (this.overridenWidth) {
        return this.overridenWidth;
      }

      return this.width;
    },
  },

  watch: {
    isOpen() {
      this.overridenWidth = undefined;
    },
  },

  data() {
    return {
      overridenWidth: undefined,
    };
  },
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
