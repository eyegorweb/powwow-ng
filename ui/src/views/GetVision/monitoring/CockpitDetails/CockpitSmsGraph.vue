<template>
  <div class="mb-3">
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

import { fetchSupervisionGraphSMS } from '@/api/supervision.js';
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
      const data = await fetchSupervisionGraphSMS({
        supervisionType: this.supervisionType,
        ...this.filters,
      });

      if (!data) return;

      const pointFormatter = (p) => {
        return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${p.series.userOptions.color}; display: inline-block; margin-right: 0.5rem"></div>
              ${p.series.userOptions.name}
              :
              ${p.y} <br/>
              `;
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
            y: formattedObj.numberOfReceivedSMS,
            myData: formattedObj,
          });

          all.out.push({
            x: formattedObj.date,
            y: formattedObj.numberOfSentSMS,
            myData: formattedObj,
          });

          all.traffics.push({
            x: formattedObj.date,
            y: formattedObj.numberOfTraffSims,
            myData: formattedObj,
          });

          return all;
        },
        { in: [], out: [], traffics: [] }
      );

      const tickPositions = formattedData.in.map(d => d.x);


      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: 'SMS par Tranches',
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
            tickPositions,
            labels: {
              formatter() {
                return formatUTCtoStrDate(this.value, 'DD. MMM');
              },
              style: {
                color: Highcharts.getOptions().colors[1],
              },
              rotation: -45
            },
            crosshair: true,
          },
        ],
        yAxis: [
          {
            labels: {
              formatter() {
                return formatLargeNumber(this.value);
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
              format: '{value} trafiquantes',
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
            name: 'SMS total',
            type: 'column',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.out, formattedData.in),
          },
          {
            name: 'SMS Reçu',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.in,
          },
          {
            name: 'SMS Emis',
            type: 'column',
            stack: 'vol',
            color: '#f39c12',
            data: formattedData.out,
          },

          {
            name: 'SIM Trafiquantes',
            type: 'spline',
            yAxis: 1,
            color: '#c8007b',
            tooltip: {
              valueSuffix: ' sim',
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
