<template>
  <div>
    <chart v-if="canShowGraph" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
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
    selectedTab: String,
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
        chart: {
          zoomType: 'xy',
          height: 160,
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
            tickInterval: 24 * 60 * 60 * 1000, // par jour
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
            name: this.$t('getreport.dashboard.legends.nbAlarms'),
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
      if (!this.partners) return;
      const data = [];
      const historyDepth = 30;
      var filledValues = [];
      if (this.selectedTab === 'ALARM') {
        this.$emit('isLoading', true);
        filledValues = await fetchAlarmInstancesIndicators(
          ['ALARM_TRIGGERED_DAY'],
          historyDepth,
          this.partners
        );
      } else if (this.selectedTab === 'SHARED_CONSO_ALARM') {
        this.$emit('isLoading', true);
        filledValues = await fetchAlarmInstancesIndicators(
          ['ALARM_POOL_TRIGGERED_DAY'],
          historyDepth,
          this.partners
        );
      }
      this.$emit('isLoading', false);

      if (filledValues[0] && filledValues[0].histories && filledValues[0].histories.length) {
        filledValues[0].histories
          .sort((a, b) => (isBefore(a.applicationDate, b.applicationDate, DATE_FORMAT) ? -1 : 1))
          .map((i) => {
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
    partners(values) {
      if (!values.length) return;
      this.refreshChart();
    },
  },
};
</script>

<style lang="scss">
.highcharts-container {
  overflow: visible !important;
  z-index: auto !important;
}
</style>
