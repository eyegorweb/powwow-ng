<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';

import { fetchVoiceUsageForGraph } from '@/api/consumption.js';

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
    const data = await fetchVoiceUsageForGraph(this.simId);
    const formattedData = data.reduce(
      (all, item) => {
        const dateFirstSplit = item.date.split(' ');
        const dateParts = dateFirstSplit[0].split('/');
        const formattedObj = {
          ...item,
          totalVoiceIO: item.outgoing + item.incoming,
          totalMinutesIO: item.outgoingMinutesTotal + item.incomingMinutesTotal,
          date: Date.UTC(
            parseInt(dateParts[2]),
            parseInt(dateParts[1] - 1),
            parseInt(dateParts[0])
          ),
        };

        all.outgoing.push([formattedObj.date, formattedObj.outgoing]);
        all.incoming.push([formattedObj.date, formattedObj.incoming]);
        all.outgoingMinutesTotal.push([formattedObj.date, formattedObj.outgoingMinutesTotal]);
        all.incomingMinutesTotal.push([formattedObj.date, formattedObj.incomingMinutesTotal]);
        all.totalVoiceIO.push([formattedObj.date, formattedObj.totalVoiceIO]);
        all.totalMinutesIO.push([formattedObj.date, formattedObj.totalMinutesIO]);

        this.$emit('haveContent', false);

        return all;
      },
      {
        outgoing: [],
        incoming: [],
        outgoingMinutesTotal: [],
        incomingMinutesTotal: [],
        totalVoiceIO: [],
        totalMinutesIO: [],
      }
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
              format: '{value}',
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
            name: 'Minutes Reçues',
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#3498db',
            data: data.incomingMinutesTotal,
          },
          {
            name: 'Minutes Emis',
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#f39c12',
            data: data.outgoingMinutesTotal,
          },
          {
            name: 'Voix Emise',
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#fda77f',
            data: data.outgoing,
          },
          {
            name: 'Voix Reçue',
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#43ab92',
            data: data.incoming,
          },

          {
            name: 'Voix E/S',
            type: 'spline',
            dashStyle: 'shortdot',
            tooltip: {
              valueSuffix: '',
            },
            color: '#505bda',
            data: data.totalVoiceIO,
          },

          {
            name: 'Minutes totales',
            type: 'spline',
            dashStyle: 'shortdot',
            tooltip: {
              valueSuffix: '',
            },
            color: '#c93838',
            data: data.totalMinutesIO,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
