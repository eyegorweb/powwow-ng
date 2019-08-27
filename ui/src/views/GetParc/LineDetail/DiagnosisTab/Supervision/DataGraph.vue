<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';

export default {
  components: {
    Chart,
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  mounted() {
    this.chartOptions = {
      credits: {
        enabled: false,
      },
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: this.title,
      },

      xAxis: [
        {
          type: 'datetime',
          crosshair: true,
        },
      ],
      yAxis: [
        {
          labels: {
            format: '{value}ko',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Volume',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        {
          // Secondary yAxis
          title: {
            text: 'Nombre de connexions pdp',
            style: {
              color: Highcharts.getOptions().colors[0],
            },
          },
          labels: {
            format: '{value} pdp',
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
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: 'Volume entrant',
          type: 'column',
          tooltip: {
            valueSuffix: ' Ko',
          },
          color: '#3498db',
          data: [
            [1167609600000, 47],
            [1167696000000, 54],
            [1167782400000, 55],
            [1167868800000, 42],
            [1167955200000, 92],
            [1168214400000, 72],
            [1168300800000, 48],
            [1168387200000, 27],
            [1168473600000, 57],
            [1168560000000, 67],
            [1168819200000, 87],
            [1168905600000, 87],
            [1168992000000, 74],
          ],
        },
        {
          name: 'Volume sortant',
          type: 'column',
          tooltip: {
            valueSuffix: ' Ko',
          },
          color: '#f39c12',
          data: [
            [1167609600000, 27],
            [1167696000000, 74],
            [1167782400000, 15],
            [1167868800000, 22],
            [1167955200000, 62],
            [1168214400000, 62],
            [1168300800000, 38],
            [1168387200000, 17],
            [1168473600000, 27],
            [1168560000000, 57],
            [1168819200000, 77],
            [1168905600000, 37],
            [1168992000000, 14],
          ],
        },
        {
          name: 'Nb cnx pdp',
          type: 'spline',
          dashStyle: 'shortdot',
          yAxis: 1,
          color: '#495057',
          data: [
            [1167609600000, 5.37],
            [1167696000000, 5.37],
            [1167782400000, 8.55],
            [1167868800000, 4.22],
            [1167955200000, 9.22],
            [1168214400000, 7.22],
            [1168300800000, 4.83],
            [1168387200000, 2.77],
            [1168473600000, 5.703],
            [1168560000000, 6.757],
            [1168819200000, 8.728],
            [1168905600000, 8.71],
            [1168992000000, 7.48],
          ],
          tooltip: {
            valueSuffix: ' pdp',
          },
        },
      ],
    };
  },
  data() {
    return {
      chartOptions: undefined,
    };
  },
};
</script>

<style lang="scss" scoped></style>
