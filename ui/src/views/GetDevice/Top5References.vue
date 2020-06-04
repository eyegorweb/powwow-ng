<template>
  <div class="bg-white p-3 mt-4">
    <h5>{{ $t('getdevice.graphes.title-graph-top5-references') }}</h5>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { lineDistributionByDeviceReference } from '@/api/deviceGraph';

export default {
  components: {
    Chart,
  },
  props: {
    partner: Object,
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  async mounted() {
    const partnerId = this.partner ? this.partner.id : undefined;
    const data = await lineDistributionByDeviceReference(partnerId);

    const formatedData = data.reduce((all, item) => {
      all.push({
        name: item.label,
        y: item.accessPointNumber,
        z: 0,
      });
      return all;
    }, []);

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
          data: formatedData,
        },
      ],
    };
  },

  watch: {
    partner() {
      this.refreshData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
