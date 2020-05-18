<template>
  <GraphContainer :size="4" can-show>
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
          renderTo: 'container',
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
        },
        title: {
          text: 'Répartition des lignes par zone',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage}%</b>',
          percentageDecimals: 1,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              color: '#000000',
              connectorColor: '#000000',
              formatter() {
                return '<b>' + this.point.name + '</b>: ' + this.percentage + '%';
              },
            },
          },
        },
        series: [
          {
            type: 'pie',
            name: 'PLMN',
            innerSize: '80%',
            data: [
              ['France ', 88.0],
              {
                name: 'Union Européenne',
                y: 6.0,
                sliced: true,
                selected: true,
              },
              ['Reste du monde', 6.0],
            ],
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
