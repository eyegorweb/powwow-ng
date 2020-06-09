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
          zoomType: 'xy',
        },
        title: {
          text: 'Nbre de lignes facturées et détail des montants facturés ',
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
            title: {
              text: 'Lignes',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            labels: {
              format: '{value}',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            opposite: true,
          },
        ],
        tooltip: {
          shared: true,
        },
        legend: {
          layout: 'vertical',
          align: 'left',
          x: 120,
          verticalAlign: 'top',
          y: 30,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)', // theme
        },
        series: [
          {
            name: 'Nb de lignes facturées',
            type: 'column',
            yAxis: 1,
            data: [49, 71, 106, 129, 144, 176, 180, 180, 216, 230, 250, 275],
            tooltip: {
              valueSuffix: ' Lignes',
            },
          },
          {
            name: 'Montant total',
            type: 'spline',
            data: [59, 81, 116, 139, 154, 186, 190, 190, 226, 240, 260, 285],
            tooltip: {
              valueSuffix: ' €',
            },
          },
          {
            name: 'Montant abonnements',
            type: 'spline',
            data: [49, 71, 106, 129, 144, 176, 180, 180, 216, 230, 250, 275],
            tooltip: {
              valueSuffix: ' €',
            },
          },
          {
            name: 'Montant dépassement Data',
            type: 'spline',
            data: [1, 2, 4, 3, 1, 2, 0, 0, 5, 3, 7, 1],
            tooltip: {
              valueSuffix: ' €',
            },
          },
          {
            name: 'Montant hors zones',
            type: 'spline',
            data: [0, 0, 0, 0, 0, 0, 0, 20, 0, 15, 0, 10],
            tooltip: {
              valueSuffix: ' €',
            },
          },
          {
            name: 'Montant des conso tests',
            type: 'spline',
            data: [20, 0, 15, 0, 10, 0, 0, 0, 0, 0, 0, 0],
            tooltip: {
              valueSuffix: ' €',
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
