<template>
  <GraphContainer
    title="getreport.dashboard.nbBilledLines"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
    skeleton-height="400"
  >
    <div slot="onHide">{{ $t('getreport.errors.partnerRequired') }}</div>
    <div
      v-if="isLoading"
      class="skeleton-line centered-error"
      :style="{ width: '100%', height: '400px' }"
    ></div>
    <div :class="{ hidden: isLoading }">
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
import { getMonthStringPreviousMonth } from '@/utils/date';
import { formatToM } from '@/api/utils.js';
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
      isLoading: false,
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
      if (this.billingAccount && this.billingAccount.data) {
        params.customerAccountCode = this.billingAccount.data.code;
      }
      if (this.offer) {
        params.offerId = this.offer.meta.initialOffer.id;
      }
      this.isLoading = true;
      const apiData = await billedLineAndAmount(
        params.partyId,
        params.customerAccountCode,
        params.offerId,
        this.currentPeriod
      );
      this.isLoading = false;

      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthStringPreviousMonth(c.date, 1);
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
        chart: {
          // type: 'Combination chart',
        },
        colors: ['#488bf7', '#083e96', 'red', '#34626c', '#fd8c04', '#dd9866', '#af6b58'],
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
              text: this.$t('getreport.dashboard.legends.amount'),
              style: {
                color: '#083e96',
              },
            },
          },
          {
            // Secondary yAxis
            title: {
              text: this.$t('getreport.dashboard.legends.lines'),
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
          pointFormatter() {
            return `
            <tr><td style="color:${this.series.color};padding:0">${this.series.name}: </td>
            <td style="padding:0"><b>${formatToM(this.y)} ${
              this.series.options.custom.devise
            }</b></td></tr>
              `;
          },
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
            name: this.$t('getreport.dashboard.legends.billedLines'),
            data: dataSeries.billedLines,
            custom: { devise: this.$t('getreport.dashboard.legends.nbOfLines') },
            type: 'column',
            yAxis: 1,
          },
          {
            name: this.$t('getreport.dashboard.legends.totalAmount'),
            data: dataSeries.totalAmount,
            custom: { devise: '€' },
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountSubscription'),
            data: dataSeries.suscribeAmount,
            custom: { devise: '€' },
            type: 'column',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountData'),
            data: dataSeries.amountData,
            custom: { devise: '€' },
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountByCounter'),
            data: dataSeries.amountConso,
            custom: { devise: '€' },
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountOutOfZone'),
            data: dataSeries.amountOutOfZone,
            custom: { devise: '€' },
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountTestConso'),
            data: dataSeries.amountTestConso,
            custom: { devise: '€' },
            type: 'spline',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
