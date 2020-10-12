<template>
  <div class="mb-3">
    <chart v-if="chartOptions" :options="chartOptions" />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import { fetchConsoHistory } from '@/api/consumption.js';
import { getMonthString } from '@/utils/date';
import { formatBytes } from '@/api/utils';

export default {
  components: {
    Chart,
  },

  props: {
    partner: Object,
    billingAccount: Object,
  },

  mounted() {
    this.refreshData();
  },

  data() {
    return {
      chartOptions: undefined,
    };
  },

  methods: {
    async refreshData() {
      if (!this.partner) return;

      const params = {
        partyId: this.partner.id,
      };

      if (this.billingAccount) {
        params.customerAccountCode = this.billingAccount.data.code;
      }

      const data = await fetchConsoHistory(params);
      if (!data) return;

      const dataConsumption = data.dataConsumption;

      const formattedData = dataConsumption.reduce(
        (all, c) => {
          const month = getMonthString(c.consumptionDate);
          all.categories.push(month.slice(0, 3));
          all.consumptionFrIn.push(c.consumptionFrIn);
          all.consumptionFrOut.push(c.consumptionFrOut);
          all.consumptionRoamingIn.push(c.consumptionRoamingIn);
          all.consumptionRoamingOut.push(c.consumptionRoamingOut);
          return all;
        },
        {
          categories: [],
          consumptionFrIn: [],
          consumptionFrOut: [],
          consumptionRoamingIn: [],
          consumptionRoamingOut: [],
        }
      );

      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          type: 'column',
        },
        colors: ['#488bf7', '#083e96', '#dc73de', '#9c109e'],
        title: {
          text: '',
        },
        xAxis: [
          {
            categories: formattedData.categories,
            crosshair: true,
          },
        ],
        yAxis: {
          labels: {
            formatter() {
              return formatBytes(this.value);
            },
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
          title: {
            text: 'Conso',
            style: {
              color: Highcharts.getOptions().colors[1],
            },
          },
        },
        tooltip: {
          formatter() {
            return (
              '<b>' +
              this.x +
              '</b><br/>' +
              this.series.name +
              ': ' +
              formatBytes(this.y) +
              '<br/>' +
              'Total: ' +
              formatBytes(this.point.stackTotal)
            );
          },
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            zones: [
              {
                color: '#FE2E64',
                value: 2,
              },
            ],
          },
        },

        series: [
          {
            name: this.$t('getreport.dashboard.legends.incomingFrance'),
            data: formattedData.consumptionFrIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.legends.incomingRoming'),
            data: formattedData.consumptionRoamingIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.legends.outgoingFrance'),
            data: formattedData.consumptionFrOut,
            stack: 'sortant',
          },
          {
            name: this.$t('getreport.dashboard.legends.outgoingRoaming'),
            data: formattedData.consumptionRoamingOut,
            stack: 'sortant',
          },
        ],
      };
    },
  },
  watch: {
    partner() {
      this.refreshData();
    },
    billingAccount() {
      this.refreshData();
    },
  },
};
</script>

<style lang="scss" scoped></style>
