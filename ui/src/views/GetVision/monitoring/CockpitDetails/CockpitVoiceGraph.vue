<template>
  <div class="mb-3">
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';

import { fetchSupervisionGraphVoice } from '@/api/supervision.js';

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
    partnerId: Number,
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
      const params = {};
      if (this.partnerId) {
        params.partyIds = [this.partnerId];
      }

      const data = await fetchSupervisionGraphVoice({
        supervisionType: this.supervisionType,
        params,
      });

      const formattedData = data.reduce(
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
          all.minIn.push([formattedObj.date, formattedObj.volumeIn]);
          all.minOut.push([formattedObj.date, formattedObj.volumeOut]);
          all.nbCallsIn.push([formattedObj.date, formattedObj.numberCallsIn]);
          all.nbCallsOut.push([formattedObj.date, formattedObj.numberCallsOut]);
          all.trafficSMS.push([formattedObj.date, formattedObj.numberTraffSims]);

          return all;
        },
        { minIn: [], minOut: [], nbCallsIn: [], nbCallsOut: [], trafficSMS: [] }
      );

      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: '',
          align: 'left',
        },
        subtitle: {
          text: ' ',
          align: 'left',
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
                return this.value;
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
            return `
              <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${this.series.userOptions.color}; display: inline-block; margin-right: 0.5rem"></div>
              ${this.series.userOptions.name}
              :
              ${this.y} <br/>
              `;
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
            name: 'Minutes total',
            type: 'column',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.minIn, formattedData.minOut),
          },
          {
            name: 'Minutes Reçues',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.minIn,
          },
          {
            name: 'Minutes emies',
            type: 'column',
            stack: 'vol',
            color: '#3498db',
            data: formattedData.minOut,
          },

          {
            name: 'Appels Entrants',
            type: 'column',
            stack: 'vol',
            visible: false,
            color: '#6cc3de',
            data: formattedData.nbCallsIn,
          },
          {
            name: 'Appels Sortants',
            type: 'column',
            stack: 'vol',
            color: '#debc6c',
            visible: false,
            data: formattedData.nbCallsOut,
          },

          {
            name: 'Minutes total',
            type: 'spline',
            stack: 'vol',
            color: '#05d0a6',
            visible: false,
            data: this.sumAllData(formattedData.nbCallsIn, formattedData.nbCallsOut),
          },

          {
            name: 'SIM Traffiquantes',
            type: 'spline',
            yAxis: 1,
            color: '#c8007b',
            tooltip: {
              valueSuffix: ' sim',
            },
            data: formattedData.trafficSMS,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
