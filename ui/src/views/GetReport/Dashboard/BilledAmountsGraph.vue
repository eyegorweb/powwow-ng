<template>
  <GraphWithToggle :size="12" can-show>
    <chart v-if="chartOptions" :options="chartOptions" />

    <div slot="onHide">
      Texte d'erreur ici
    </div>
  </GraphWithToggle>
</template>

<script>
import GraphWithToggle from './GraphWithToggle';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

export default {
  components: {
    Chart,
    GraphWithToggle,
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

        colors: ['#488bf7', '#083e96', '#000000'],

        title: {
          text: 'Montants facturés sur 12 / 24 / 36 mois',
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
              format: '{value} €',
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
            title: {
              text: 'Montant',
              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
          },
          {
            // Secondary yAxis
            labels: {
              format: '{value} Mo',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            title: {
              text: 'Conso',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },

            opposite: true,
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
            name: 'Facturé',
            type: 'column',
            data: [50, 30, 40, 70, 20, 60, 80, 40, 70, 90, 100, 120],
          },
          {
            name: 'Non facturé',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Montant',
            type: 'spline',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            tooltip: {
              valueSuffix: '°€',
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
