<template>
  <GraphContainer :size="12" :can-show="!!(partner && partner.id)">
    <div>
      <AlarmsPerDayGraph
        title="Nombre d'alarmes déclenchées par jour"
        :partners="selectedPartnerIds"
      />
    </div>
    <div slot="onHide">{{ $t('getreport.errors.partnerRequired') }}</div>
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

  mounted() {
    if (this.partner) {
      this.selectedPartnerIds = [this.partner.id];
    }
  },

  data() {
    return {
      selectedPartnerIds: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
