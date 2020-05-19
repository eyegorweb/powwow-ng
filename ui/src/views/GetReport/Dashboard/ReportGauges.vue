<template>
  <GraphContainer title="Encours de consommation" :size="12" :can-show="!!offerForGauge">
    <div class="d-flex justify-content-end">
      <Toggle
        v-if="toggleValues"
        @update="currentValue = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>
    <ConsoGauges v-if="currentValue === 'graph'" :selected-offer="offerForGauge">
      <h4>Veuillez choisir un compte de facturation et une offre</h4>
    </ConsoGauges>
    <ConsoTable v-else :partner="partner" :offer="offer" :billing-account="billingAccount" />
    <div slot="onHide">
      Veuillez sélectionner un CF et une offre.
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import ConsoTable from './ConsoTable';
import ConsoGauges from '@/components/widgets/ConsoGauges.vue';
import get from 'lodash.get';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    GraphContainer,
    ConsoTable,
    ConsoGauges,
    Toggle,
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  mounted() {},

  data() {
    return {
      currentValue: 'graph',
      toggleValues: [
        {
          id: 'graph',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.graph',
        },
        {
          id: 'table',
          label: 'getparc.lineDetail.tab2.lineAnalysisContent.toggle.table',
        },
      ],
    };
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
