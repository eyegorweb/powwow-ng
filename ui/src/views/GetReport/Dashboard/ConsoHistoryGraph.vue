<template>
  <GraphContainer
    title="getreport.dashboard.consoHistory"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div>
      <div class="d-flex justify-content-end">
        <Toggle
          v-if="toggleValues"
          @update="currentUsage = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <chart v-if="chartOptions" :options="chartOptions" />
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import { fetchConsoHistory } from '@/api/consumption.js';
import { getMonthString } from '@/utils/date';
import Toggle from '@/components/ui/UiToggle2';

import { formatBytes, resumeFormattedValueFromSeconds } from '@/api/utils';

export default {
  components: {
    Chart,
    GraphContainer,
    Toggle,
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  computed: {
    canShow() {
      const partnerChosen = !!(this.partner && this.partner.id);
      const offerChosen = !!(this.offer && this.offer.id);
      if (offerChosen) {
        return offerChosen;
      } else {
        return partnerChosen;
      }
    },
    showWarningMsg() {
      const offerChosen = !!(this.offer && this.offer.id);
      if (offerChosen) {
        return true;
      } else {
        return false;
      }
    },
  },

  data() {
    return {
      chartOptions: undefined,
      apiData: undefined,
      currentUsage: 'data',
      tooltipMsg: this.$t('getdevice.messages.warning2'),
      toggleValues: [
        {
          id: 'data',
          label: 'services.DATA',
          defaut: true,
        },
        {
          id: 'sms',
          label: 'services.SMS',
        },
        {
          id: 'voice',
          label: 'services.VOICE',
        },
      ],
    };
  },

  watch: {
    partner() {
      this.createGraph();
    },
    billingAccount() {
      this.createGraph();
    },
    currentUsage() {
      this.createGraph();
    },
  },

  mounted() {
    this.createGraph();
  },

  methods: {
    async createGraph() {
      if (!this.canShow) return;

      const params = {
        partyId: this.partner.id,
      };

      if (this.billingAccount) {
        params.customerAccountCode = this.billingAccount.data.code;
      }
      this.apiData = await fetchConsoHistory(params);

      const smsConsumption = this.apiData.smsConsumption;
      const voiceConsumption = this.apiData.voiceConsumption;
      const dataConsumption = this.apiData.dataConsumption;

      let dataSeries = undefined;
      if (this.currentUsage === 'data') {
        dataSeries = dataConsumption.reduce(
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
      }

      if (this.currentUsage === 'sms') {
        dataSeries = smsConsumption.reduce(
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
      }

      if (this.currentUsage === 'voice') {
        dataSeries = voiceConsumption.reduce(
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
      }

      if (!dataSeries) return;

      // transformer les données
      const currentUsage = this.currentUsage;
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
            categories: dataSeries.categories,
            crosshair: true,
          },
        ],

        yAxis: {
          // Primary yAxis
          labels: {
            format: '{value}',
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
            if (currentUsage === 'data') {
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
            } else if (currentUsage === 'voice') {
              return (
                '<b>' +
                this.x +
                '</b><br/>' +
                this.series.name +
                ': ' +
                resumeFormattedValueFromSeconds(this.y) +
                '<br/>' +
                'Total: ' +
                resumeFormattedValueFromSeconds(this.point.stackTotal)
              );
            } else {
              return (
                '<b>' +
                this.x +
                '</b><br/>' +
                this.series.name +
                ': ' +
                this.y +
                '<br/>' +
                'Total: ' +
                this.point.stackTotal
              );
            }
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
            name: this.$t('getreport.dashboard.incomingFrance'),
            data: dataSeries.consumptionFrIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.incomingRoming'),
            data: dataSeries.consumptionRoamingIn,
            stack: 'entrant',
          },
          {
            name: this.$t('getreport.dashboard.outgoingFrance'),
            data: dataSeries.consumptionFrOut,
            stack: 'sortant',
          },
          {
            name: this.$t('getreport.dashboard.outgoingRoaming'),
            data: dataSeries.consumptionRoamingOut,
            stack: 'sortant',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
