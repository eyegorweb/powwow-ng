<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
    <div v-else class="graph-skeleton skeleton-line"></div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import { formatBytes } from '@/api/utils.js';

export default {
  components: {
    Chart,
  },
  props: {
    allDataUsageStreams: Array,
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  mounted() {
    this.createChart();
  },

  computed: {
    allSeriesFormatted() {
      return this.allDataUsageStreams.map((usageData) => {
        const formattedData = usageData.splitPDPConnectionHistories.reduce(
          (all, item) => {
            const dateFirstSplit = item.date.split(' ');
            const dateParts = dateFirstSplit[0].split('/');
            const formattedObj = {
              ...item,
              date: Date.UTC(
                parseInt(dateParts[2]),
                parseInt(dateParts[1] - 1),
                parseInt(dateParts[0])
              ),
            };
            all.in.push([formattedObj.date, formattedObj.download]);
            all.out.push([formattedObj.date, formattedObj.upload]);
            all.pdp.push([formattedObj.date, formattedObj.pdpConnectionsNumber]);

            return all;
          },
          { in: [], out: [], pdp: [] }
        );
        return {
          usageType: usageData.stream,
          splitData: formattedData,
        };
      });
    },
  },

  methods: {
    sumAllData(dataOut, dataIn) {
      let all = dataOut.map((n) => {
        const corresponding = dataIn.find((c) => c[0] == n[0]);
        const sum = n[1] + corresponding[1];
        return [n[0], sum];
      });
      return all;
    },

    getSeries() {
      const series = this.allSeriesFormatted.map((d) => ({
        name: d.usageType,
        //  type: 'column',
        tooltip: {
          valueSuffix: 'Ko',
        },
        // color: '#05d0a6',
        data: this.sumAllData(d.splitData.out, d.splitData.in),
      }));

      return series;
    },
    createChart() {
      const series = this.getSeries();
      this.chartOptions = {
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
              formatter() {
                return formatBytes(this.value, 0);
              },
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
        ],
        tooltip: {
          shared: true,
          useHTML: true,
          xDateFormat: '%d/%m/%Y',
          pointFormatter() {
            return `<div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
              this.series.userOptions.color
            }; display: inline-block; margin-right: 0.5rem"></div>${
              this.series.userOptions.name
            } : ${formatBytes(this.y)} <br/>`;
          },
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            zones: [
              {
                color: '#FE2E64',
                value: 2,
              },
            ],
          },
        },

        series,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
