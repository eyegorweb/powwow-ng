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
          text: 'Conso et montant moyen par ligne facturée',
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
              text: 'Conso',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            labels: {
              format: '{value} Mo',
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
          y: 100,
          floating: true,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)', // theme
        },
        series: [
          {
            name: 'Conso',
            type: 'column',
            yAxis: 1,
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            tooltip: {
              valueSuffix: ' Mo',
            },
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
