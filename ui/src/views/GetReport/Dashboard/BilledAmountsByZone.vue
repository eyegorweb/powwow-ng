<template>
  <GraphContainer
    title="Montants facturés / Conso par zone"
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
      // const apiData = await parcStatusByMonth(
      //   params.partyId,
      //   params.customerAccountCode,
      //   this.currentPeriod
      // );

      // Data mock:
      const apiData = [
        {
          overspend: 50,
          contract: 30,
          outOfZone: 30,
          amountData: 7.0,
          amountVoice: 6.9,
          amountSMS: 9.5,
          amountSubscription: 5,
          date: '01/09/2019',
        },
        {
          overspend: 30,
          contract: 40,
          outOfZone: 40,
          amountData: 7.0,
          amountVoice: 6.9,
          amountSMS: 9.5,
          amountSubscription: 5,
          date: '01/10/2019',
        },
        {
          overspend: 40,
          contract: 40,
          outOfZone: 40,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 18.2,
          amountSubscription: 5,
          date: '01/11/2019',
        },
        {
          overspend: 70,
          contract: 20,
          outOfZone: 14.5,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 21.5,
          amountSubscription: 5,
          date: '01/12/2019',
        },
        {
          overspend: 20,
          contract: 50,
          outOfZone: 18.2,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 25.2,
          amountSubscription: 5,
          date: '01/01/2020',
        },
        {
          overspend: 60,
          contract: 0,
          outOfZone: 21.2,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 26.5,
          amountSubscription: 5,
          date: '01/02/2020',
        },
        {
          overspend: 80,
          contract: 50,
          outOfZone: 25.2,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 23.3,
          amountSubscription: 5,
          date: '01/03/2020',
        },
        {
          overspend: 40,
          contract: 40,
          outOfZone: 26.5,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 18.3,
          amountSubscription: 5,
          date: '01/04/2020',
        },
        {
          overspend: 70,
          contract: 20,
          outOfZone: 23.3,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 13.9,
          amountSubscription: 5,
          date: '01/05/2020',
        },
        {
          overspend: 90,
          contract: 10,
          outOfZone: 18.3,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 9.6,
          amountSubscription: 5,
          date: '01/06/2020',
        },
        {
          overspend: 100,
          contract: 40,
          outOfZone: 13.9,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 7.0,
          amountSubscription: 5,
          date: '01/07/2020',
        },
        {
          overspend: 120,
          contract: 100,
          outOfZone: 9.6,
          amountData: 9.5,
          amountVoice: 14.5,
          amountSMS: 6.9,
          amountSubscription: 5,
          date: '01/08/2020',
        },
      ];
      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.overspend.push(c.overspend);
          all.contract.push(c.contract);
          all.outOfZone.push(c.outOfZone);
          all.amountData.push(c.amountData);
          all.amountVoice.push(c.amountVoice);
          all.amountSMS.push(c.amountSMS);
          all.amountSubscription.push(c.amountSubscription);
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
            name: 'Dépassement',
            data: dataSeries.overspend,
            type: 'column',
            stack: 'forfait',
          },
          {
            name: 'Forfait',
            data: dataSeries.contract,
            type: 'column',
            stack: 'forfait',
          },
          {
            name: 'Hors zone',
            data: dataSeries.outOfZone,
            type: 'column',
          },
          {
            name: 'Montant Data',
            data: dataSeries.amountData,
            type: 'spline',
          },
          {
            name: 'Montant Voix',
            data: dataSeries.amountVoice,
            type: 'spline',
          },
          {
            name: 'Montant SMS',
            data: dataSeries.amountSMS,
            type: 'spline',
          },
          {
            name: 'Montant abo',
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
