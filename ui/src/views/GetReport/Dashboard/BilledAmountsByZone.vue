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
        chart: {
          type: 'column',
        },

        colors: ['#488bf7', '#083e96', 'red', '#fafa5a', '#e3e340', '#c9c926', '#adad13'],

        title: {
          text: 'Montants facturés / Conso par zone',
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
            name: 'Dépassement',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
            stack: 'forfait',
          },
          {
            name: 'Forfait',
            data: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
            stack: 'forfait',
          },
          {
            name: 'Hors zone',
            type: 'column',
            data: [30, 40, 40, 20, 50, 0, 50, 40, 20, 10, 40, 100],
          },
          {
            name: 'Montant Data',
            type: 'spline',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            tooltip: {
              valueSuffix: '°€',
            },
          },
          {
            name: 'Montant voix',
            type: 'spline',
            data: [6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 7.0],
            tooltip: {
              valueSuffix: '°€',
            },
          },
          {
            name: 'Montant SMS',
            type: 'spline',
            data: [9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6, 7.0, 6.9],
            tooltip: {
              valueSuffix: '°€',
            },
          },
          {
            name: 'Montant abo',
            type: 'spline',
            data: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
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
