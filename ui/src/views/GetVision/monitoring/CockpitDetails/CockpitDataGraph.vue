<template>
  <div class="mb-3">
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

import { fetchSupervisionGraphData } from '@/api/supervision.js';
import { formatBytes } from '@/api/utils.js';
import { formatLargeNumber } from '@/utils/numbers';

export default {
  components: {
    Chart,
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  props: {
    supervisionType: String,
    filters: Object,
  },

  mounted() {
    this.refreshData();
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
    async refreshData() {
      const data = await fetchSupervisionGraphData({
        supervisionType: this.supervisionType,
        params: this.filters,
      });

      if (!data) return;

      const formattedData = data.responses.reduce(
        (all, item) => {
          const dateFirstSplit = item.date.split(' ');
          const dateParts = dateFirstSplit[0].split('/');
          const timeParts =
            dateFirstSplit && dateFirstSplit.length > 1 ? dateFirstSplit[1].split(':') : ['0'];
          const formattedObj = {
            ...item,
            date: Date.UTC(
              parseInt(dateParts[2]),
              parseInt(dateParts[1] - 1),
              parseInt(dateParts[0]),
              parseInt(timeParts[0])
            ),
          };
          all.in.push([formattedObj.date, formattedObj.download]);
          all.out.push([formattedObj.date, formattedObj.upload]);
          all.pdp.push([formattedObj.date, formattedObj.numberRequests]);
          all.openings.push([formattedObj.date, formattedObj.numberRequestsOpening]);
          all.traffics.push([formattedObj.date, formattedObj.numberTraffSims]);

          return all;
        },
        { in: [], out: [], pdp: [], openings: [], traffics: [] }
      );
      // console.log(formattedData.lastUpdateDate);
      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: 'Data par Tranches',
          align: 'center',
        },
        subtitle: {
          text: 'Dernière mise à jour:' + data.lastUpdateDate,
          align: 'center',
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
              style: {
                textShadow: '0 0 3px black',
              },
            },
          },
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
              text: '',

              style: {
                color: Highcharts.getOptions().colors[1],
              },
            },
          },
          {
            allowDecimals: false,
            title: {
              text: '',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },

            labels: {
              format: '{value} lignes',
              formatter() {
                return formatLargeNumber(this.value);
              },
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            opposite: true,
          },
          {
            allowDecimals: false,
            title: {
              text: '',
              style: {
                color: Highcharts.getOptions().colors[0],
              },
            },
            labels: {
              format: '{value} pdp',
              formatter() {
                return formatLargeNumber(this.value);
              },
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
            if (!this.series.userOptions.name.includes('Volume')) {
              return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
                this.series.userOptions.color
                }; display: inline-block; margin-right: 0.5rem"></div>
              ${this.series.userOptions.name}
              :
              ${formatLargeNumber(this.y)} <br/>
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
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
          floating: false,
          backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'rgba(255,255,255,0.25)', // theme
        },
        series: [
          {
            name: 'Volume total',
            type: 'column',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.out, formattedData.in),
          },
          {
            name: 'Volume entrant',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.in,
          },
          {
            name: 'Volume sortant',
            type: 'column',
            stack: 'vol',
            color: '#f39c12',
            data: formattedData.out,
          },
          {
            name: 'Nombre de connexions PDP',
            type: 'spline',
            dashStyle: 'shortdot',
            yAxis: 2,
            color: '#495057',
            tooltip: {
              valueSuffix: ' pdp',
            },
            data: formattedData.pdp,
          },
          {
            name: 'Ouvertures PDP',
            type: 'spline',
            yAxis: 2,
            color: '#c8007b',
            tooltip: {
              valueSuffix: ' pdp',
            },
            data: formattedData.openings,
          },
          {
            name: 'Nombre de lignes',
            type: 'spline',
            yAxis: 1,
            color: '#6cc3de',
            tooltip: {
              valueSuffix: ' lignes',
            },
            data: formattedData.traffics,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
