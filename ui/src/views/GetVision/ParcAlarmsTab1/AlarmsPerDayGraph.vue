<template>
  <div>
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import Highcharts from 'highcharts';
import 'highcharts/css/highcharts.css';

export default {
  components: {
    Chart,
  },
  props: {},
  async mounted() {
    const data = [];
    for (let i = 1; i < 29; i++) {
      data.push([Date.UTC(2019, 10, i), Math.floor(Math.random() * Math.floor(3)) + 1]);
    }
    this.createChart(data);
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
          height: 200,
        },
        title: {
          text: "Nombre d'alarmes déclenchées",
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
  },
};
</script>

<style lang="scss"></style>
