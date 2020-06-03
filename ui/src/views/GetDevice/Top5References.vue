<template>
  <div class="bg-white p-3 mt-4">
    <h5>Top 5 Fabriquant M-1</h5>
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
    // il faudra remplir les données ici
    // s'inspirer de ça ui/src/views/GetReport/Dashboard/LinesPerZoneGraph.vue
    const formateddata = [
      {
        name: 'Spain',
        y: 505370,
        z: 92.9,
      },
      {
        name: 'France',
        y: 551500,
        z: 118.7,
      },
      {
        name: 'France',
        y: 5500,
        z: 118.7,
      },
      {
        name: 'France',
        y: 50,
        z: 118.7,
      },
    ];

    this.chartOptions = {
      chart: {
        type: 'variablepie',
        height: 200,
      },
      plotOptions: {
        variablepie: {
          size: 90,
        },
      },
      title: {
        text: '',
      },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : {point.y} %</b><br/>' +
          'Nombre de lignes: <b>{point.z}</b><br/>',
      },
      series: [
        {
          innerSize: '70%',
          zMin: 0,
          name: 'Zone',
          data: formateddata,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
