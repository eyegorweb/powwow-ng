<template>
  <GraphContainer title="Nombre d'alarmes déclenchées par jour" :size="12" :can-show="canShow">
    <div>
      <AlarmsPerDayGraph title="" :partners="selectedPartnerIds" />
    </div>
    <div slot="onHide">
      <div class="alert alert-warning" v-if="offer || billingAccount">
        {{ $t('getreport.errors.dontSelectOfferOrCF') }}
      </div>
      <div v-else>
        {{ $t('getreport.errors.partnerRequired') }}
      </div>
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
      const offerChosen = !!(this.offer && this.offer.id);
      const billingAccountChosen = !!(this.billingAccount && this.billingAccount.id);

      if (offerChosen && billingAccountChosen) {
        return !offerChosen && !billingAccountChosen;
      } else {
        return partnerChosen && !offerChosen && !billingAccountChosen;
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
