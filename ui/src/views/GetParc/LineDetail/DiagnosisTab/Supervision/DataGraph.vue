<template>
  <div>
    <GenericDataGraph v-if="usageData" :usage-data="usageData" />
  </div>
</template>

<script>
import GenericDataGraph from './streamGraphs/GenericDataGraph.vue';
import { fetchDataConsumptionForGraph } from '@/api/consumption.js';

export default {
  components: {
    GenericDataGraph,
  },
  props: {
    simId: [String, Number],
  },
  data() {
    return {
      usageData: undefined,
    };
  },
  async mounted() {
    this.usageData = await fetchDataConsumptionForGraph(this.simId);
  },
};
</script>

<style lang="scss" scoped></style>
