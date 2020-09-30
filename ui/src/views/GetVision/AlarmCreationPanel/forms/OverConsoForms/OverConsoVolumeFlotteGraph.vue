<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" :callback="onChartCreated" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';

function getMockData() {
  const mockData = [];

  for (let i = 1; i <= 31; i++) {
    mockData.push({
      date: `${i}/9/2020`,
      value: 0,
    });
  }

  return mockData;
}

function getLimits(initLimits, data) {
  if (initLimits && initLimits.length) {
    const limitsWithoutLast = initLimits.slice(0, initLimits.length - 1);
    const lastLimit = initLimits[initLimits.length - 1];

    const parts = data[data.length - 1].date.split('/');
    const lastDayOfMonth = parseInt(parts[0]);

    limitsWithoutLast.push([lastDayOfMonth, lastLimit[1]]);

    return limitsWithoutLast;
  }

  return [];
}

export default {
  components: {
    Chart,
  },

  props: {
    initLimits: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      canShowGraph: false,
      chartOptions: undefined,
      chartInstance: undefined,
    };
  },

  watch: {
    initLimits(limits) {
      if (limits.length) {
        this.updateChart();
      }
    },
  },

  mounted() {
    this.createChart();
  },

  methods: {
    onChartCreated(chart) {
      this.chartInstance = chart;
    },
    updateChart() {
      if (this.chartInstance) {
        const mockData = getMockData();
        const limits = getLimits(this.initLimits, mockData);

        this.chartInstance.series[1].update({
          type: 'scatter',
          name: 'Seuils saisis',
          data: limits,
          color: '#c8007b',
          marker: {
            symbol: 'circle',
            radius: 4,
          },
        });
      }
    },
    createChart() {
      const mockData = getMockData();
      const limits = getLimits(this.initLimits, mockData);

      const getxAxisCategories = () => {
        const formatted = mockData.map(d => {
          const parts = d.date.split('/');
          return parseInt(parts[0]);
        });

        return formatted;
      };

      const getLastMonthConsoSerie = () => {
        return mockData.map(d => d.value);
      };

      const $emit = (name, params) => {
        this.$emit(name, params);
      };

      this.chartOptions = {
        chart: {
          height: 160,
          events: {
            click(e) {
              let x = Math.round(e.xAxis[0].value),
                y = Math.round(e.yAxis[0].value),
                series = this.series[1];
              if (series.data.length < 3) {
                series.addPoint([x, y]);
                $emit('setLimits', series.data.map(s => [s.x, s.y]));
              }
            },
          },
        },
        credits: {
          enabled: false,
        },

        title: {
          text: '',
          align: 'left',
        },

        xAxis: {
          crosshair: true,
          tickPositions: getxAxisCategories(),
          min: 1,
          max: 31,
        },
        yAxis: [
          {
            labels: {
              format: '{value}%',
            },
            title: {
              text: '',
            },
            max: 100,
            crosshair: true,
            endOnTick: true,
          },
        ],

        plotOptions: {
          series: {
            point: {
              events: {
                click() {
                  /*
                  if (this.series.index === 1) {
                    const series = this.series;
                    this.remove();
                    $emit('setLimits', series.data.map(s => [s.x, s.y]));
                  }
                  //*/
                },
              },
            },
          },
        },

        series: [
          {
            name: 'Conso data nov.',
            pointStart: 1,
            data: getLastMonthConsoSerie(),
          },
          {
            type: 'scatter',
            name: 'Seuils saisis',
            data: limits,
            color: '#c8007b',
            marker: {
              symbol: 'circle',
              radius: 4,
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
