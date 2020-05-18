<template>
  <GraphContainer :size="12" can-show>
    <div>
      <chart v-if="chartOptions" :options="chartOptions" />
    </div>
    <div slot="onHide">
      Texte d'erreur ici
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

export default {
  components: {
    Chart,
    GraphContainer,
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  mounted() {
    this.createGraph();
  },

  methods: {
    createGraph() {
      this.chartOptions = {
        chart: {
          type: 'column',
        },

        colors: ['#488bf7', '#083e96', '#dc73de', '#9c109e'],

        title: {
          text: 'Historique des consommations',
        },

        xAxis: [
          {
            categories: [
              'Jan',
              'Fev',
              'Mar',
              'Avr',
              'Mai',
              'Jun',
              'Jul',
              'Aou',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            crosshair: true,
          },
        ],

        yAxis: {
          // Primary yAxis
          labels: {
            format: '{value} Mo',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Conso',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        tooltip: {
          formatter() {
            return (
              '<b>' +
              this.x +
              '</b><br/>' +
              this.series.name +
              ': ' +
              this.y +
              '<br/>' +
              'Total: ' +
              this.point.stackTotal
            );
          },
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            zones: [
              {
                color: '#FE2E64',
                value: 2,
              },
            ],
          },
        },
        series: [
          {
            name: 'France entrant',
            data: [50, 30, 40, 70, 20, 60, 80, 40, 70, 90, 100, 120],
            stack: 'entrant',
          },
          {
            name: 'Roaming entrant',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
            stack: 'entrant',
          },
          {
            name: 'France sortant',
            data: [20, 50, 60, 20, 10, 20, 10, 30, 40, 20, 20, 10],
            stack: 'sortant',
          },
          {
            name: 'Roaming sortant',
            data: [30, 0, 40, 40, 30, 20, 10, 30, 30, 40, 0, 10],
            stack: 'sortant',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
