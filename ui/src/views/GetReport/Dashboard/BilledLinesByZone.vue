<template>
  <GraphContainer
    title="Nbre de lignes facturées et conso par zone"
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
      // const apiData = await parcStatusByMonth(
      //   params.partyId,
      //   params.customerAccountCode,
      //   this.currentPeriod
      // );
      // Data mock:
      const apiData = [
        {
          billedLines: 50,
          consoFrance: 30,
          consoEU: 30,
          consoOufOfEU: 7.0,
          date: '01/09/2019',
        },
        {
          billedLines: 30,
          consoFrance: 40,
          consoEU: 40,
          consoOufOfEU: 7.0,
          date: '01/10/2019',
        },
        {
          billedLines: 40,
          consoFrance: 40,
          consoEU: 40,
          consoOufOfEU: 9.5,
          date: '01/11/2019',
        },
        {
          billedLines: 70,
          consoFrance: 20,
          consoEU: 14.5,
          consoOufOfEU: 9.5,
          date: '01/12/2019',
        },
        {
          billedLines: 20,
          consoFrance: 50,
          consoEU: 18.2,
          consoOufOfEU: 9.5,
          date: '01/01/2020',
        },
        {
          billedLines: 60,
          consoFrance: 0,
          consoEU: 21.2,
          consoOufOfEU: 9.5,
          date: '01/02/2020',
        },
        {
          billedLines: 80,
          consoFrance: 50,
          consoEU: 25.2,
          consoOufOfEU: 9.5,
          date: '01/03/2020',
        },
        {
          billedLines: 40,
          consoFrance: 40,
          consoEU: 26.5,
          consoOufOfEU: 9.5,
          date: '01/04/2020',
        },
        {
          billedLines: 70,
          consoFrance: 20,
          consoEU: 23.3,
          consoOufOfEU: 9.5,
          date: '01/05/2020',
        },
        {
          billedLines: 90,
          consoFrance: 10,
          consoEU: 18.3,
          consoOufOfEU: 9.5,
          date: '01/06/2020',
        },
        {
          billedLines: 100,
          consoFrance: 40,
          consoEU: 13.9,
          consoOufOfEU: 9.5,
          date: '01/07/2020',
        },
        {
          billedLines: 120,
          consoFrance: 100,
          consoEU: 9.6,
          consoOufOfEU: 9.5,
          date: '01/08/2020',
        },
      ];
      const dataSeries = apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.consoFrance.push(c.consoFrance);
          all.consoEU.push(c.consoEU);
          all.consoOufOfEU.push(c.consoOufOfEU);
          all.billedLines.push(c.billedLines);
          return all;
        },
        {
          categories: [],
          consoFrance: [],
          consoEU: [],
          consoOufOfEU: [],
          billedLines: [],
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
          },
        },
        series: [
          {
            name: 'Conso France',
            data: dataSeries.consoFrance,
            type: 'column',
          },
          {
            name: 'Conso EU',
            data: dataSeries.consoEU,
            type: 'column',
          },
          {
            name: 'Conso hors EU',
            data: dataSeries.consoOufOfEU,
            type: 'column',
          },
          {
            name: 'Nb de lignes facturées',
            data: dataSeries.billedLines,
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
