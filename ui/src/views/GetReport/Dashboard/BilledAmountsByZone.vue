<template>
  <GraphContainer
    title="getreport.dashboard.billedAmount"
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
import { getMonthString } from '@/utils/date';
import { billedAmountByZone } from '@/api/reportDashboard.js';
import { formatBytes } from '@/api/utils.js';

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
      this.isLoading = true;
      const apiData = await billedAmountByZone(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );
      this.isLoading = false;

      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.overspend.push(c.depassement);
          all.contract.push(c.forfait);
          all.outOfZone.push(c.horsForfait);
          all.amountData.push(c.data);
          all.amountVoice.push(c.voice);
          all.amountSMS.push(c.sms);
          all.amountSubscription.push(c.abonnement);
          return all;
        },
        {
          categories: [],
          overspend: [],
          contract: [],
          outOfZone: [],
          amountData: [],
          amountVoice: [],
          amountSMS: [],
          amountSubscription: [],
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
            min: 0,
            title: {
              text: '',
            },
          },
          {
            title: {
              text: '',
            },
            opposite: true,
          },
        ],

        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormatter() {
            return `
            <tr><td style="color:${this.series.color};padding:0">${this.series.name}: </td>
            <td style="padding:0"><b>${
              this.series.options.custom.isData ? formatBytes(this.y) : this.y + ' €'
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
            name: this.$t('getreport.dashboard.legends.overtaking'),
            data: dataSeries.overspend,
            custom: { isData: true },
            type: 'column',
            stack: 'forfait',
          },
          {
            name: this.$t('getreport.dashboard.legends.contract'),
            data: dataSeries.contract,
            custom: { isData: true },
            type: 'column',
            stack: 'forfait',
          },
          {
            name: this.$t('getreport.dashboard.legends.outOfZone'),
            data: dataSeries.outOfZone,
            custom: { isData: true },
            type: 'column',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountData'),
            data: dataSeries.amountData,
            custom: { isData: false },
            type: 'spline',
            yAxis: 1,
          },
          {
            name: this.$t('getreport.dashboard.legends.amountVoice'),
            data: dataSeries.amountVoice,
            custom: { isData: false },
            type: 'spline',
            yAxis: 1,
          },
          {
            name: this.$t('getreport.dashboard.legends.amountSMS'),
            data: dataSeries.amountSMS,
            custom: { isData: false },
            type: 'spline',
            yAxis: 1,
          },
          {
            name: this.$t('getreport.dashboard.legends.amountSubscription'),
            data: dataSeries.amountSubscription,
            custom: { isData: false },
            type: 'spline',
            yAxis: 1,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
