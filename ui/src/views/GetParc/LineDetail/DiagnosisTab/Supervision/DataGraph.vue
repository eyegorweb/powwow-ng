<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import { fetchDataConsumptionForGraph } from '@/api/consumption.js';
import { formatBytes } from '@/api/utils.js';

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
    simId: String,
  },
  async mounted() {
    const data = await fetchDataConsumptionForGraph(this.simId);
    const formattedData = data.reduce(
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

        this.$emit('haveContent', false);

        return all;
      },
      { in: [], out: [], pdp: [] }
    );
    this.createChart(formattedData);
  },
  data() {
    return {
      chartOptions: undefined,
      haveContent: false,
    };
  },

  methods: {
    sumAllData(dataOut, dataIn) {
      let all = dataOut.map(n => {
        const corresponding = dataIn.find(c => c[0] == n[0]);
        const sum = n[1] + corresponding[1];
        return [n[0], sum];
      });
      return all;
    },

    createChart(data) {
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
          {
            // Secondary yAxis
            allowDecimals: false,
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
          useHTML: true,
          xDateFormat: '%d/%m/%Y',
          pointFormatter() {
            if (this.series.userOptions.name == 'Nombre de connexions PDP') {
              return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${this.series.userOptions.color}; display: inline-block; margin-right: 0.5rem"></div>
              ${this.series.userOptions.name}
              :
              ${this.y} <br/>
              `;
            } else {
              return `<div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
                this.series.userOptions.color
              }; display: inline-block; margin-right: 0.5rem"></div>${
                this.series.userOptions.name
              } : ${formatBytes(this.y)} <br/>`;
            }
          },
        },
        series: [
          {
            name: 'Volume entrant',
            type: 'column',
            tooltip: {
              valueSuffix: 'Ko',
            },
            color: '#3498db',
            data: data.in,
          },
          {
            name: 'Volume sortant',
            type: 'column',
            tooltip: {
              valueSuffix: 'Ko',
            },
            color: '#f39c12',
            data: data.out,
          },
          {
            name: 'Volume total',
            type: 'column',
            tooltip: {
              valueSuffix: 'Ko',
            },
            color: '#05d0a6',
            data: this.sumAllData(data.out, data.in),
          },
          {
            name: 'Nombre de connexions PDP',
            type: 'spline',
            dashStyle: 'shortdot',
            yAxis: 1,
            color: '#495057',
            tooltip: {
              valueSuffix: ' pdp',
            },
            data: data.pdp,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
