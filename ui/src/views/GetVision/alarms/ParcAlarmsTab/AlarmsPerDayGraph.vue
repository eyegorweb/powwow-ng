<template>
  <div>
    <chart v-if="canShowGraph" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import 'highcharts/css/highcharts.css';
import { fetchAlarmInstancesIndicators } from '@/api/alarms';
import { isBefore, DATE_FORMAT } from '@/utils/date.js';

export default {
  components: {
    Chart,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    partners: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.refreshChart();
  },
  computed: {
    canShowGraph() {
      return !this.noResult && this.chartOptions;
    },
  },
  data() {
    return {
      chartOptions: undefined,
      haveContent: false,
      noResult: false,
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
          height: 200,
        },
        title: {
          text: this.title || '',
          align: 'left',
        },

        xAxis: [
          {
            type: 'datetime',
            crosshair: true,
            labels: {
              rotation: -45,
            },
            tickInterval: 24 * 3600 * 1000,
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
          xDateFormat: '%d %b %Y',
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: 'Nb Alarmes',
            type: 'column',
            showInLegend: false,
            color: '#009dcc',
            tooltip: {
              valueSuffix: '',
            },
            data,
          },
        ],
      };
    },
    async refreshChart() {
      const data = [];
      const historyDepth = 30;
      const filledValues = await fetchAlarmInstancesIndicators(
        ['ALARM_TRIGGERED_DAY'],
        historyDepth,
        this.partners
      );

      if (filledValues[0] && filledValues[0].histories && filledValues[0].histories.length) {
        filledValues[0].histories
          .sort((a, b) => (isBefore(a.applicationDate, b.applicationDate, DATE_FORMAT) ? -1 : 1))
          .map(i => {
            const dateParts = i.applicationDate.split('/');
            const formattedObj = {
              date: Date.UTC(
                parseInt(dateParts[2]),
                parseInt(dateParts[1] - 1),
                parseInt(dateParts[0])
              ),
              value: i.numberValue,
            };
            data.push([formattedObj.date, formattedObj.value]);
          });
      }
      this.createChart(data);
    },
  },
  watch: {
    partners() {
      this.refreshChart();
    },
  },
};
</script>

<style lang="scss"></style>
