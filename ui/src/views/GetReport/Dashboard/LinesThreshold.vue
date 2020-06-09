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
        credits: {
          enabled: false,
        },
        chart: {
          type: 'Combination chart',
        },

        colors: ['#2213ad', '#2c1bc4', '#3e2ce6', '#4e3df2', '#5d4ef2', '#6b5df0'],

        title: {
          text: 'Nombre de lignes par palier',
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

        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: '{value}',
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
            title: {
              text: 'Lignes',
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
          },
        ],

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
            name: 'Palier 1',
            type: 'column',
            data: [50, 30, 40, 70, 20, 60, 80, 40, 70, 90, 100, 120],
          },
          {
            name: 'Palier 1',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Palier 3',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Palier 4',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Palier 5',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Palier 6',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
