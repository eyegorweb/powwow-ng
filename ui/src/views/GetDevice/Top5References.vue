<template>
  <div class="bg-white p-3 mt-4">
    <h5>{{ $t('getdevice.graphes.title-graph-top5-references') }}</h5>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';

export default {
  components: {
    Chart,
  },
  props: {
    refreshData: Function,
    chartOptions: Object,
  },

  mounted() {
    this.refreshData();
  },
};
</script>

<style lang="scss" scoped></style>
