<template>
  <GraphContainer :size="12" :can-show="canShow">
    <div>
      {{ offer }}
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
    <div slot="onHide">
      <template v-if="offer">
        {{ $t('getreport.errors.dontSelectOffer') }}
      </template>
      {{ $t('getreport.errors.partnerRequired') }}
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

      return partnerChosen && !offerChosen;
    }
  },

  data() {
    return {
      chartOptions: undefined,
      apiData: undefined,
      currentUsage: 'data',
      toggleValues: [
        {
          id: 'data',
          label: 'services.DATA',
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

      if (!this.apiData) {
        const params = {
          partyId: this.partner.id,
        };

        if (this.billingAccount) {
          params.customerAccountCode = this.billingAccount.data.code;
        }
        this.apiData = await fetchConsoHistory(params);
      }

      const smsConsumption = this.apiData.smsConsumption;
      const voiceConsumption = this.apiData.voiceConsumption;
      const dataConsumption = this.apiData.dataConsumption;

      let consuptionToUse = undefined;

      if (this.currentUsage === 'data') {
        consuptionToUse = dataConsumption;
      }

      if (this.currentUsage === 'sms') {
        consuptionToUse = smsConsumption;
      }

      if (this.currentUsage === 'voice') {
        consuptionToUse = voiceConsumption;
      }

      if (!consuptionToUse) return;

      const dataSeries = consuptionToUse.reduce(
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

      // transformer les données
      this.chartOptions = {
        chart: {
          type: 'column',
        },

        colors: ['#488bf7', '#083e96', '#dc73de', '#9c109e'],

        title: {
          text: 'Historique des consommations',
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
            name: 'France entrant',
            data: dataSeries.consumptionFrIn,
            stack: 'entrant',
          },
          {
            name: 'Roaming entrant',
            data: dataSeries.consumptionRoamingIn,
            stack: 'entrant',
          },
          {
            name: 'France sortant',
            data: dataSeries.consumptionFrOut,
            stack: 'sortant',
          },
          {
            name: 'Roaming sortant',
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
