<template>
  <GraphContainer
    title="getreport.dashboard.billedAmountByPeriods"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
    skeleton-height="400"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
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
import { billedAmountByMonth } from '@/api/reportDashboard.js';

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
      const apiData = await billedAmountByMonth(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );
      this.isLoading = false;

      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.nbBilledLines.push(c.nbBilledLines);
          all.nbNotBilledLines.push(c.nbNotBilledLines);
          all.amount.push(c.amount);
          all.devises = ['facturées', 'non facturées', '€'];
          return all;
        },
        {
          categories: [],
          nbBilledLines: [],
          nbNotBilledLines: [],
          devises: [],
          amount: [],
        }
      );
      this.chartOptions = {
        chart: {
          type: 'Combination chart',
        },
        colors: ['#488bf7', '#083e96', '#000000'],
        title: {
          text: '',
        },
        xAxis: {
          categories: dataSeries.categories,
          crosshair: true,
        },
        yAxis: {
          title: {
            text: '',
          },
        },

        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormatter() {
            return `
              <tr><td style="color:${this.series.color};padding:0">${this.series.name}: </td>
              <td style="padding:0"><b>${this.y +
                ' ' +
                this.series.options.custom.amountOf}</b></td></tr>
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
            custom: { amountOf: this.$t('getreport.dashboard.legends.nbOfLines') },
            type: 'column',
            data: dataSeries.nbBilledLines,
          },
          {
            name: this.$t('getreport.dashboard.legends.notBilledLines'),
            custom: { amountOf: this.$t('getreport.dashboard.legends.nbOfLines') },
            type: 'column',
            data: dataSeries.nbNotBilledLines,
          },
          {
            name: this.$t('getreport.dashboard.legends.amount'),
            custom: { amountOf: '€' },
            type: 'spline',
            data: dataSeries.amount,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
