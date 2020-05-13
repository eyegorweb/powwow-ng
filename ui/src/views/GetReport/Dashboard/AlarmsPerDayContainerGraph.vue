<template>
  <GraphContainer :size="12" can-show>
    <div>
      <AlarmsPerDayGraph
        title="Nombre d'alarmes déclenchées par jour"
        :partners="selectedPartnerIds"
      />
    </div>
    <div slot="onHide">
      Texte d'erreur ici
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

  data() {
    return {
      selectedPartnerIds: [2],
    };
  },
};
</script>

<style lang="scss" scoped></style>
