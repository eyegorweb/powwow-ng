<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
    <div v-else class="graph-skeleton skeleton-line"></div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import { resumeFormattedValueFromSeconds } from '@/api/utils.js';

import { fetchVoiceUsageForGraph } from '@/api/consumption.js';

export default {
  name: 'VoiceGraph',
  components: {
    Chart,
  },
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    simId: [String, Number],
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
          useHTML: true,
          pointFormatter() {
            if (this.series.userOptions.name.includes('Minutes')) {
              return `
                <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${
                  this.series.userOptions.color
                }; display: inline-block; margin-right: 0.5rem"></div>
                ${this.series.userOptions.name}
                :
                ${resumeFormattedValueFromSeconds(this.y)} <br/>
              `;
            } else {
              return `
                <div style="width: 7px; height: 7px; border-radius: 15px; background-color: ${this.series.userOptions.color}; display: inline-block; margin-right: 0.5rem"></div>
                ${this.series.userOptions.name}
                :
                ${this.y} <br/>
              `;
            }
          },
        },
        plotOptions: {
          series: {
            marker: {
              enabled: false,
            },
          },
        },
        series: [
          {
            name: this.$t('getparc.lineDetail.supervision.minutesIn'),
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#3498db',
            data: data.incomingMinutesTotal,
          },
          {
            name: this.$t('getparc.lineDetail.supervision.minutesOut'),
            type: 'column',
            color: '#f39c12',
            data: data.outgoingMinutesTotal,
          },
          {
            name: this.$t('getparc.lineDetail.supervision.voiceIn'),
            type: 'column',
            color: '#fda77f',
            data: data.outgoing,
          },
          {
            name: this.$t('getparc.lineDetail.supervision.voiceOut'),
            type: 'column',
            color: '#43ab92',
            data: data.incoming,
          },

          {
            name: this.$t('getparc.lineDetail.supervision.voiceInAndOut'),
            type: 'spline',
            dashStyle: 'shortdot',
            color: '#505bda',
            data: data.totalVoiceIO,
          },

          {
            name: this.$t('getparc.lineDetail.supervision.totalMinutes'),
            type: 'spline',
            dashStyle: 'shortdot',
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
