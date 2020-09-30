<template>
  <GraphContainer
    title="home.widgets.topTriggeredAlarmsPerDay"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div>
      <AlarmsPerDayGraph title="" :partners="selectedPartnerIds" />
    </div>
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import AlarmsPerDayGraph from '@/views/GetVision/alarms/ParcAlarmsTab/AlarmsPerDayGraph.vue';

export default {
  components: {
    GraphContainer,
    AlarmsPerDayGraph,
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  watch: {
    partner() {
      if (this.partner) {
        this.selectedPartnerIds = [this.partner.id];
      }
    },
  },

  computed: {
    canShow() {
      const partnerChosen = !!(this.partner && this.partner.id);
      if (partnerChosen) return true;
      return false;
    },

    showWarningMsg() {
      const billingAccountChosen = !!(this.billingAccount && this.billingAccount.id);
      const offerChosen = !!(this.offer && this.offer.id);
      if (billingAccountChosen || offerChosen) return true;
      return false;
    },
  },

  mounted() {
    if (this.partner) {
      this.selectedPartnerIds = [this.partner.id];
    }
  },

  data() {
    return {
      selectedPartnerIds: [],
      tooltipMsg: this.$t('getdevice.messages.warning1'),
    };
  },
};
</script>

<style lang="scss" scoped></style>
