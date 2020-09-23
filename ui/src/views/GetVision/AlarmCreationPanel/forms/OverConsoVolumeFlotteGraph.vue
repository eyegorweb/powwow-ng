<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import { formatDateToUTC } from '@/utils/date';

export default {
  components: {
    Chart,
  },

  props: {
    initLimits: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      canShowGraph: false,
      chartOptions: undefined,
    }
  },

  watch: {
    initLimits(limits) {
      console.log("limits -> limits", limits)
    }
  },

  mounted() {
    this.createChart([
      {
        date: formatDateToUTC('1/1/2020'),
        value: 1
      },
      {
        date: formatDateToUTC('1/2/2020'),
        value: 4
      },
      {
        date: formatDateToUTC('1/3/2020'),
        value: 12
      },
      {
        date: formatDateToUTC('1/4/2020'),
        value: 29
      },
      {
        date: formatDateToUTC('1/5/2020'),
        value: 34
      },
      {
        date: formatDateToUTC('1/6/2020'),
        value: 55
      },
      {
        date: formatDateToUTC('1/7/2020'),
        value: 98
      }
    ]);
  },

  methods: {
    createChart(data) {
      const $emit = (name, params) => {
        this.$emit(name, params);
      };

      this.$emit('setLimits', []);

      this.chartOptions = {
        chart: {
          events: {
            click: function (e) {
              let x = Math.round(e.xAxis[0].value),
                y = Math.round(e.yAxis[0].value),
                series = this.series[1];
              series.addPoint([x, y]);
              $emit('setLimits', series.data.map(s => ([s.x, s.y])));
            }
          }
        },
        credits: {
          enabled: false,
        },

        title: {
          text: '',
          align: 'left',
        },

        xAxis: {
          type: 'datetime',
          crosshair: true,
        },
        yAxis: [
          {
            labels: {
              format: '{value}',
            },
            title: {
              text: '',
            },
            max: 100,
            crosshair: true,
          },
        ],

        plotOptions: {
          series: {
            point: {
              events: {
                click: function () {
                  if (this.series.index === 1) {
                    this.remove();
                  }
                }
              }
            }
          }
        },

        series: [
          {
            name: 'Conso data nov.',
            data: data.map(r => [r.date, r.value]),
          },

          {
            name: 'Seuils saisis',
            data: this.initLimits,
          },
        ],
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
