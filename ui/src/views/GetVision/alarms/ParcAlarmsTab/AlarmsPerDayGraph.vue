<template>
  <div>
    <div v-if="noResult" class="alert-light">{{ $t('noResult') }}</div>
    <template v-else>
      <chart v-if="chartOptions" :options="chartOptions" />
    </template>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import 'highcharts/css/highcharts.css';
import { fetchAlarmInstancesIndicators } from '@/api/alarms';
import moment from 'moment';

export default {
  components: {
    Chart,
  },
  props: {
    displayTitle: {
      type: Boolean,
      default: true,
    },
    selectedParnerId: String,
  },
  mounted() {
    this.refreshChart();
  },
  data() {
    return {
      chartOptions: undefined,
      haveContent: false,
      noResult: false,
    };
  },
  computed: {
    title() {
      return this.displayTitle ? this.$t('home.widgets.topTriggeredAlarmsPerDay') : '';
    },
  },
  methods: {
    createChart(data) {
      if (data && !data.length) {
        this.noResult = true;
      } else {
        this.noResult = false;
      }
      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          zoomType: 'xy',
          height: 200,
        },
        title: {
          text: this.title,
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
      const nbDaysCurrentMonth = moment().daysInMonth();
      const filledValues = await fetchAlarmInstancesIndicators(
        ['ALARM_TRIGGERED_DAY'],
        nbDaysCurrentMonth,
        [this.selectedParnerId]
      );

      if (filledValues[0] && filledValues[0].histories && filledValues[0].histories.length) {
        filledValues[0].histories.map(i => {
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
    selectedParnerId() {
      this.refreshChart();
    },
  },
};
</script>

<style lang="scss"></style>
