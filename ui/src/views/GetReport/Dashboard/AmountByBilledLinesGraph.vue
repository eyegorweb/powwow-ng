<template>
  <GraphContainer
    title="Conso et montant moyen par ligne facturée"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div>
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
      chartOptions: undefined,
      currentPeriod: 'MONTH12',
      currentUsage: 'data',
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
      // const apiData = await parcStatusByMonth(
      //   params.partyId,
      //   params.customerAccountCode,
      //   this.currentPeriod
      // );
      // Data mock:
      const apiData = [
        {
          amount: 50,
          conso: 30,
          date: '01/09/2019',
        },
        {
          amount: 30,
          conso: 40,
          date: '01/10/2019',
        },
        {
          amount: 40,
          conso: 40,
          date: '01/11/2019',
        },
        {
          amount: 70,
          conso: 20,
          date: '01/12/2019',
        },
        {
          amount: 20,
          conso: 50,
          date: '01/01/2020',
        },
        {
          amount: 60,
          conso: 0,
          date: '01/02/2020',
        },
        {
          amount: 80,
          conso: 50,
          date: '01/03/2020',
        },
        {
          amount: 40,
          conso: 40,
          date: '01/04/2020',
        },
        {
          amount: 70,
          conso: 20,
          date: '01/05/2020',
        },
        {
          amount: 90,
          conso: 10,
          date: '01/06/2020',
        },
        {
          amount: 100,
          conso: 40,
          date: '01/07/2020',
        },
        {
          amount: 120,
          conso: 100,
          date: '01/08/2020',
        },
      ];
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
      this.chartOptions = {
        credits: {
          enabled: false,
        },
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
              text: 'Montant',
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
              text: 'Conso',
              style: {
                color: '#488bf7',
              },
            },
            labels: {
              format: '{value} Mo',
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
            name: 'Conso',
            type: 'column',
            data: dataSeries.conso,
            yAxis: 1,
          },
          {
            name: 'Montant',
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
