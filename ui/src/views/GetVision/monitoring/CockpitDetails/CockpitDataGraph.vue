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
import { formatUTCtoStrDate } from '@/utils/date.js';

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

  async mounted() {
    await this.refreshData();
    this.$emit('loaded');
  },
  watch: {
    filters() {
      this.refreshData();
    },
  },

  methods: {
    sumAllData(dataOut, dataIn) {
      return dataOut.map((n) => {
        const corresponding = dataIn.find((c) => c.x == n.x);
        const sum = n.y + corresponding.y;
        return {
          x: n.x,
          y: sum,
          myData: n.myData,
        };
      });
    },
    async refreshData() {
      const data = await fetchSupervisionGraphData({
        supervisionType: this.supervisionType,
        ...this.filters,
      });

      if (!data) return;

      const pointFormatter = (p) => {
        if (!p.series.userOptions.name.includes('Volume')) {
          return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
                p.series.userOptions.color
              }; display: inline-block; margin-right: 0.5rem"></div>
              ${p.series.userOptions.name}
              :
              ${formatLargeNumber(p.y) || '0'} <br/>
              `;
        } else {
          return `<div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
            p.series.userOptions.color
          }; display: inline-block; margin-right: 0.5rem"></div>${
            p.series.userOptions.name
          } : ${formatBytes(p.y)} <br/>`;
        }
      };

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
          all.in.push({
            x: formattedObj.date,
            y: formattedObj.download,
            myData: formattedObj,
          });
          all.out.push({
            x: formattedObj.date,
            y: formattedObj.upload,
            myData: formattedObj,
          });
          all.pdp.push({
            x: formattedObj.date,
            y: formattedObj.numberRequests,
            myData: formattedObj,
          });
          all.openings.push({
            x: formattedObj.date,
            y: formattedObj.numberRequestsOpening,
            myData: formattedObj,
          });

          all.traffics.push({
            x: formattedObj.date,
            y: formattedObj.numberTraffSims,
            myData: formattedObj,
          });

          return all;
        },
        { in: [], out: [], pdp: [], openings: [], traffics: [] }
      );
      // console.log(formattedData.lastUpdateDate);

      const tickPositions = formattedData.in.map((d) => d.x);
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
            // tickInterval: 1,
            tickPositions,
            labels: {
              formatter() {
                return formatUTCtoStrDate(this.value, 'DD. MMM');
              },
              style: {
                color: Highcharts.getOptions().colors[1],
              },
              rotation: -45,
            },
            // type: 'datetime',
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
          formatter() {
            return this.points.reduce(
              (all, p) => {
                const pointOut = pointFormatter(p);
                all.push(pointOut);
                return all;
              },
              [this.points[0].point.myData.formatDate, '<br />']
            );
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
            name: this.$t('bills.lineTotal'),
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
