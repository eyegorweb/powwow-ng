<template>
  <GraphContainer
    title="getreport.dashboard.nbBilledLines"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div slot="onHide">{{ $t('getreport.errors.partnerRequired') }}</div>
    <div>
      <div class="d-flex justify-content-end">
        <Toggle
          v-if="toggleValues"
          @update="currentPeriod = $event.id"
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
import { Chart } from 'highcharts-vue';
import Toggle from '@/components/ui/UiToggle2';
import { getMonthString } from '@/utils/date';
import { billedLineAndAmount } from '@/api/reportDashboard.js';

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
      if (offerChosen) return true;
      return false;
    },
  },

  watch: {
    partner() {
      this.createGraph();
    },
    billingAccount() {
      this.createGraph();
    },
    currentPeriod() {
      this.createGraph();
    },
  },

  data() {
    return {
      chartOptions: undefined,
      currentPeriod: 'MONTH12',
      tooltipMsg: this.$t('getdevice.messages.warning2'),
      toggleValues: [
        {
          id: 'MONTH12',
          label: 'common.months_12',
        },
        {
          id: 'MONTH24',
          label: 'common.months_24',
        },
        {
          id: 'MONTH36',
          label: 'common.months_36',
        },
      ],
    };
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
      const apiData = await billedLineAndAmount(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );
      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.billedLines.push(c.billedLines);
          all.totalAmount.push(c.totalAmount);
          all.suscribeAmount.push(c.suscribeAmount);
          all.amountData.push(c.amountData);
          all.amountConso.push(c.dataConsoCompteur + c.smsConsoCompteur + c.voixConsoCompteur);
          all.amountOutOfZone.push(c.dataHorsZone + c.smsHorsZone + c.voixHorsZone);
          all.amountTestConso.push(c.dataConsoTest + c.smsConsoTest + c.voixConsoTest);
          return all;
        },
        {
          categories: [],
          billedLines: [],
          totalAmount: [],
          suscribeAmount: [],
          amountData: [],
          amountConso: [],
          amountOutOfZone: [],
          amountTestConso: [],
        }
      );
      this.chartOptions = {
        credits: {
          enabled: false,
        },
        chart: {
          // type: 'Combination chart',
        },
        colors: ['#488bf7', '#083e96', 'red', '#fafa5a', '#e3e340', '#c9c926', '#adad13'],
        title: {
          text: '',
        },
        xAxis: {
          categories: dataSeries.categories,
          crosshair: true,
        },

        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: '{value} €',
              style: {
                color: '#083e96',
              },
            },
            title: {
              text: 'Montant',
              style: {
                color: '#083e96',
              },
            },
          },
          {
            // Secondary yAxis
            title: {
              text: 'Lignes',
              style: {
                color: '#488bf7',
              },
            },
            labels: {
              format: '{value}',
              style: {
                color: '#488bf7',
              },
            },
            opposite: true,
          },
        ],

        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            stacking: 'normal',
          },
        },
        series: [
          {
            name: 'Nb de lignes facturées',
            data: dataSeries.billedLines,
            type: 'column',
            yAxis: 1,
          },
          {
            name: 'Montant total',
            data: dataSeries.totalAmount,
            type: 'spline',
          },
          {
            name: 'Montant abonnements',
            data: dataSeries.suscribeAmount,
            type: 'column',
          },
          {
            name: 'Montant Data',
            data: dataSeries.amountData,
            type: 'spline',
          },
          {
            name: 'Montant conso au compteur',
            data: dataSeries.amountConso,
            type: 'spline',
          },
          {
            name: 'Montant hors zones',
            data: dataSeries.amountOutOfZone,
            type: 'spline',
          },
          {
            name: 'Montant des conso tests',
            data: dataSeries.amountTestConso,
            type: 'spline',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
