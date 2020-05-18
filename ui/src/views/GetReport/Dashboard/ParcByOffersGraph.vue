<template>
  <GraphContainer :size="4" can-show>
    <div>
      <chart v-if="chartOptions" :options="chartOptions" />
    </div>
    <div slot="onHide">Texte d'erreur ici</div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import { fetchDistributionInfo } from '@/api/ParcStateGraph';
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

  async mounted() {
    const data = await fetchDistributionInfo();
    const formateddata = data.reduce((all, item) => {
      all.push({ name: item.offer, y: item.percentage, z: item.accessPointNumber });
      return all;
    }, []);
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
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : {point.y} %</b><br/>' +
          'Nombre de lignes: <b>{point.z}</b><br/>',
      },
      series: [
        {
          innerSize: '70%',
          zMin: 0,
          name: 'Offre',
          data: formateddata,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
