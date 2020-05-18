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
    GraphContainer,
    Chart,
  },
  data() {
    return {
      chartOptions: undefined,
    };
  },

  mounted() {
    this.chartOptions = {
      chart: {
        type: 'variablepie',
      },
      title: {
        text: 'Répartition du parc par offre',
      },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
          'Area (square km): <b>{point.y}</b><br/>' +
          'Population density (people per square km): <b>{point.z}</b><br/>',
      },
      series: [
        {
          innerSize: '70%',
          zMin: 0,
          name: 'countries',
          data: [
            {
              name: 'Spain',
              y: 505370,
              z: 90,
            },
            {
              name: 'France',
              y: 551500,
              z: 90,
            },
            {
              name: 'Poland',
              y: 312685,
              z: 90,
            },
            {
              name: 'Czech Republic',
              y: 78867,
              z: 90,
            },
            {
              name: 'Italy',
              y: 301340,
              z: 90,
            },
            {
              name: 'Switzerland',
              y: 41277,
              z: 90,
            },
            {
              name: 'Germany',
              y: 357022,
              z: 90,
            },
          ],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
