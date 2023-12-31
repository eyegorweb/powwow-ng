<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
    <div v-else class="graph-skeleton skeleton-line"></div>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';

import { fetchSMSConsumption } from '@/api/consumption.js';

export default {
  name: 'SMSGraph',
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
    const data = await fetchSMSConsumption(this.simId);
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

        all.in.push([formattedObj.date, formattedObj.numberOfReceivedSMS]);
        all.out.push([formattedObj.date, formattedObj.numberOfSentSMS]);

        this.$emit('haveContent', false);

        return all;
      },
      { in: [], out: [] }
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
            name: this.$t('getparc.lineDetail.supervision.smsIn'),
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#3498db',
            data: data.in,
          },
          {
            name: this.$t('getparc.lineDetail.supervision.smsOut'),
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#f39c12',
            data: data.out,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
