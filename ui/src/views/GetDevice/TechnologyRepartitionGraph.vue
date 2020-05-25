<template>
  <div class="bg-white p-3 mt-4">
    <h5>Nombre de lignes par techno</h5>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';

export default {
  components: {
    Chart,
  },
  data() {
    return {
      chartOptions: undefined,
    };
  },
  async mounted() {
    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<b>{point.y:.1f}</b>',
      },
      series: [
        {
          name: 'Population',
          data: [
            ['2G', 24.2],
            ['3G', 20.8],
            ['4G', 14.9],
            ['5G', 13.7],
            ['LTEM', 13.1],
            ['NBIOT', 12.7],
            ['LOR', 12.4],
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
