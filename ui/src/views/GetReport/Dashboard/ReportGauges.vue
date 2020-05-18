<template>
  <GraphContainer :size="12" :can-show="!!offerForGauge">
    <ConsoGauges :selected-offer="offerForGauge">
      <h4>Veuillez choisir un compte de facturation et une offre</h4>
    </ConsoGauges>
    <div slot="onHide">
      Veuillez choisir une offre et un compte de facturation
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import ConsoGauges from '@/components/widgets/ConsoGauges.vue';
import get from 'lodash.get';

export default {
  components: {
    GraphContainer,
    ConsoGauges,
  },

  props: {
    offer: Object,
    billingAccount: Object,
  },

  computed: {
    offerForGauge() {
      const workflowId = get(this.offer, 'meta.id');
      const customerAccoutId = get(this.billingAccount, 'data.id');

      if (!workflowId || !customerAccoutId) return undefined;

      return {
        workflowId,
        customerAccoutId,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
