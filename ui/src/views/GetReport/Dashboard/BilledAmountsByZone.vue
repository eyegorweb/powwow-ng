<template>
  <GraphContainer
    title="getreport.dashboard.billedAmount"
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
      // TODO: api billedAmountAndConsoByZoneGraph à brancher
      const apiData = await billedAmountByZone(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );
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
        yAxis: {
          min: 0,
          title: {
            text: '',
          },
        },

        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormatter() {
            return `
            <tr><td style="color:${this.series.color};padding:0">${this.series.name}: </td>
            <td style="padding:0"><b>${formatBytes(this.y)}</b></td></tr>
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
            type: 'column',
            stack: 'forfait',
          },
          {
            name: this.$t('getreport.dashboard.legends.contract'),
            data: dataSeries.contract,
            type: 'column',
            stack: 'forfait',
          },
          {
            name: this.$t('getreport.dashboard.legends.outOfZone'),
            data: dataSeries.outOfZone,
            type: 'column',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountData'),
            data: dataSeries.amountData,
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountVoice'),
            data: dataSeries.amountVoice,
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountSMS'),
            data: dataSeries.amountSMS,
            type: 'spline',
          },
          {
            name: this.$t('getreport.dashboard.legends.amountSubscription'),
            data: dataSeries.amountSubscription,
            type: 'spline',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
