<template>
  <div class="bg-white p-3 mt-4">
    <h5>{{ $t('getdevice.graphes.title-graph-techno-repartition') }}</h5>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { lineDistributionByTechno } from '@/api/deviceGraph';

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
    const data = await lineDistributionByTechno(partnerId);

    const formatedData = data.reduce((all, item) => {
      all.push({
        name: item.label,
        y: item.accessPointNumber,
      });
      return all;
    }, []);

    this.chartOptions = {
      chart: {
        type: 'bar',
        height: 200,
      },
      title: {
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '',
        },
      },
      legend: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '<b>{point.y:.1f}</b>',
      },
      series: [
        {
          name: 'Population',
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
