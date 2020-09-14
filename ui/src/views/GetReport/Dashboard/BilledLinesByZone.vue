<template>
  <GraphContainer
    title="Nbre de lignes facturées et conso par zone"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div slot="onHide">{{ $t('getreport.errors.partnerRequired') }}</div>
    <div>
      <div class="d-flex justify-content-between">
        <Toggle
          v-if="usageToggleValues"
          @update="currentUsage = $event.id"
          :values="usageToggleValues"
          class="pl-2"
        />
        <Toggle
          v-if="periodToggleValues"
          @update="currentPeriod = $event.id"
          :values="periodToggleValues"
          class="pl-2"
        />
      </div>
      <chart v-if="dataChartOptions && currentUsage === 'DATA'" :options="dataChartOptions" />
      <chart v-if="smsChartOptions && currentUsage === 'SMS'" :options="smsChartOptions" />
      <chart v-if="voiceChartOptions && currentUsage === 'VOICE'" :options="voiceChartOptions" />
    </div>
  </GraphContainer>
</template>
<script>
import GraphContainer from './GraphContainer';
import { Chart } from 'highcharts-vue';
import Toggle from '@/components/ui/UiToggle2';
import { getMonthString } from '@/utils/date';
import { billedLineConsoZone } from '@/api/reportDashboard.js';
import { formatBytes, formattedValueFromSeconds } from '@/api/utils.js';
import { formatLargeNumber } from '@/utils/numbers';

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
      dataChartOptions: undefined,
      smsChartOptions: undefined,
      voiceChartOptions: undefined,
      currentPeriod: 'MONTH12',
      tooltipMsg: this.$t('getdevice.messages.warning2'),
      currentUsage: 'DATA',
      usageToggleValues: [
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
      periodToggleValues: [
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
      const apiData = await billedLineConsoZone(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );

      const chartData = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          /*
          all.consoFrance.push(c.consoFr);
          all.consoEU.push(c.consoEU);
          all.consoOufOfEU.push(c.consoHorsEU);
          all.billedLines.push(c.nbBilledLine);
          //*/
          all.dataConsoFr.push(c.dataConsoFr);
          all.dataConsoEU.push(c.dataConsoEU);
          all.dataConsoHorsEU.push(c.dataConsoHorsEU);
          all.smsConsoFr.push(c.smsConsoFr);
          all.smsConsoEU.push(c.smsConsoEU);
          all.smsConsoHorsEU.push(c.smsConsoHorsEU);
          all.voixConsoFr.push(c.voixConsoFr);
          all.voixConsoEU.push(c.voixConsoEU);
          all.voixConsoHorsEU.push(c.voixConsoHorsEU);
          all.nbBilledLine.push(c.nbBilledLine);
          return all;
        },
        {
          categories: [],
          dataConsoFr: [],
          dataConsoEU: [],
          dataConsoHorsEU: [],
          smsConsoFr: [],
          smsConsoEU: [],
          smsConsoHorsEU: [],
          voixConsoFr: [],
          voixConsoEU: [],
          voixConsoHorsEU: [],
          nbBilledLine: [],
        }
      );

      this.buildDataChartOptions(chartData);
      this.buildVoiceChartOptions(chartData);
      this.buildSMSChartOptions(chartData);
    },

    buildDataChartOptions(chartData) {
      this.dataChartOptions = {
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
          categories: chartData.categories,
          crosshair: true,
        },

        yAxis: [
          {
            // Primary yAxis
            labels: {
              formatter() {
                return formatBytes(this.value, 0);
              },
              style: {
                color: '#083e96',
              },
            },
            title: {
              text: 'Conso',
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
          },
        },
        series: [
          {
            name: 'Conso France',
            data: chartData.dataConsoFr,
            type: 'column',
          },
          {
            name: 'Conso EU',
            data: chartData.dataConsoEU,
            type: 'column',
          },
          {
            name: 'Conso hors EU',
            data: chartData.dataConsoHorsEU,
            type: 'column',
          },
          {
            name: 'Nb de lignes facturées',
            data: chartData.billedLines,
            yAxis: 1,
            type: 'spline',
          },
        ],
      };
    },
    buildVoiceChartOptions(chartData) {
      this.voiceChartOptions = {
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
          categories: chartData.categories,
          crosshair: true,
        },

        yAxis: [
          {
            // Primary yAxis
            labels: {
              formatter() {
                return formattedValueFromSeconds(this.value, 0);
              },
              style: {
                color: '#083e96',
              },
            },
            title: {
              text: 'Conso',
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
          },
        },
        series: [
          {
            name: 'Conso France',
            data: chartData.voiceConsoFr,
            type: 'column',
          },
          {
            name: 'Conso EU',
            data: chartData.voiceConsoEU,
            type: 'column',
          },
          {
            name: 'Conso hors EU',
            data: chartData.voiceConsoHorsEU,
            type: 'column',
          },
          {
            name: 'Nb de lignes facturées',
            data: chartData.billedLines,
            yAxis: 1,
            type: 'spline',
          },
        ],
      };
    },
    buildSMSChartOptions(chartData) {
      this.smsChartOptions = {
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
          categories: chartData.categories,
          crosshair: true,
        },

        yAxis: [
          {
            // Primary yAxis
            labels: {
              formatter() {
                return formatLargeNumber(this.value);
              },
              style: {
                color: '#083e96',
              },
            },
            title: {
              text: 'Conso',
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
          },
        },
        series: [
          {
            name: 'Conso France',
            data: chartData.smsConsoFr,
            type: 'column',
          },
          {
            name: 'Conso EU',
            data: chartData.smsConsoEU,
            type: 'column',
          },
          {
            name: 'Conso hors EU',
            data: chartData.smsConsoHorsEU,
            type: 'column',
          },
          {
            name: 'Nb de lignes facturées',
            data: chartData.billedLines,
            yAxis: 1,
            type: 'spline',
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
