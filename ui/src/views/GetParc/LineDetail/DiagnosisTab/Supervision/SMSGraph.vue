<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';

import { fetchSMSConsumption } from '@/api/consumption.js';

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
        series: [
          {
            name: 'SMS Reçu',
            type: 'column',
            tooltip: {
              valueSuffix: '',
            },
            color: '#3498db',
            data: data.in,
          },
          {
            name: 'SMS Emis',
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
