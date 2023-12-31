<template>
  <GraphContainer
    title="getreport.dashboard.consoAndAverageCost"
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
      <div class="d-flex justify-content-between">
        <Toggle
          v-if="toggleValuesUsage"
          @update="currentUsage = $event.id"
          :values="toggleValuesUsage"
          class="pl-2"
        />
        <Toggle
          v-if="toggleValuesPeriod"
          @update="currentPeriod = $event.id"
          :values="toggleValuesPeriod"
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
import { averageBilledAmountByMonth } from '@/api/reportDashboard.js';
import { formatBytes, resumeFormattedValueFromSeconds } from '@/api/utils.js';
import { formatLargeNumber } from '@/utils/numbers';

function convertValuesUsage(value, usage) {
  if (usage === 'DATA') {
    return formatBytes(value);
  } else if (usage === 'SMS') {
    return formatLargeNumber(value);
  } else if (usage === 'VOICE') {
    return resumeFormattedValueFromSeconds(value);
  }
}

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
    currentUsage() {
      this.createGraph();
    },
  },

  data() {
    return {
      isLoading: false,
      chartOptions: undefined,
      currentPeriod: 'MONTH12',
      currentUsage: 'DATA',
      tooltipMsg: this.$t('getdevice.messages.warning2'),
      toggleValuesPeriod: [
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
      toggleValuesUsage: [
        {
          id: 'DATA',
          label: 'services.DATA',
        },
        {
          id: 'SMS',
          label: 'services.SMS',
        },
        {
          id: 'VOICE',
          label: 'services.VOICE',
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
      const apiData = await averageBilledAmountByMonth(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod,
        this.currentUsage
      );
      this.isLoading = false;

      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.amount.push(c.amount);
          all.conso.push(c.conso);
          return all;
        },
        {
          categories: [],
          amount: [],
          conso: [],
        }
      );
      const usage = this.currentUsage;
      this.chartOptions = {
        chart: {
          zoomType: 'xy',
        },
        colors: ['#488bf7', '#083e96'],
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
            title: {
              text: this.$t('getreport.dashboard.legends.amount'),
              style: {
                color: '#083e96',
              },
            },
            labels: {
              format: '{value} €',
              style: {
                color: '#083e96',
              },
            },
          },
          {
            // Secondary yAxis
            title: {
              text: this.$t('getreport.dashboard.legends.conso'),
              style: {
                color: '#488bf7',
              },
            },
            labels: {
              formatter() {
                return convertValuesUsage(this.value, usage);
              },
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
            <td style="padding:0"><b>${
              this.series.options.custom.isData ? convertValuesUsage(this.y, usage) : this.y + ' €'
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
            name: this.$t('getreport.dashboard.legends.conso'),
            type: 'column',
            custom: { isData: true },
            data: dataSeries.conso,
            yAxis: 1,
          },
          {
            name: this.$t('getreport.dashboard.legends.amount'),
            type: 'spline',
            custom: { isData: false },
            data: dataSeries.amount,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
