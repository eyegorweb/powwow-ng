<template>
  <GraphContainer :size="12" :can-show="canShow">
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
    <div slot="onHide">
      <template v-if="offer">
        {{ $t('getreport.errors.dontSelectOffer') }}
      </template>
      <template v-else>
        {{ $t('getreport.errors.partnerRequired') }}
      </template>
    </div>
  </GraphContainer>
</template>
<script>
import GraphContainer from './GraphContainer';
import { Chart } from 'highcharts-vue';
import { parcStatusByMonth } from '@/api/reportDashboard.js';
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

      return partnerChosen && !offerChosen;
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
      apiData: undefined,
      toggleValues: [
        {
          id: 'MONTH12',
          label: 'common.months_12',
          default: true,
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

      if (!this.apiData) {
        const params = {
          partyId: this.partner.id,
        };

        if (this.billingAccount) {
          params.customerAccountCode = this.billingAccount.data.code;
        }
        this.apiData = await parcStatusByMonth(
          params.partyId,
          params.customerAccountCode,
          this.currentPeriod
        );
      }

      const dataSeries = this.apiData.reduce(
        (all, c) => {
          const month = getMonthString(c.date);
          all.categories.push(month.slice(0, 3));
          all.countStock.push(c.countStock);
          all.countPreactivated.push(c.countPreactivated);
          all.countActivated.push(c.countActivated);
          all.countCancellationInProgress.push(c.countCancellationInProgress);
          all.countTest.push(c.countTest);
          all.countReleased.push(c.countReleased);
          all.countSuspended.push(c.countSuspended);
          return all;
        },
        {
          categories: [],
          countStock: [],
          countPreactivated: [],
          countActivated: [],
          countCancellationInProgress: [],
          countTest: [],
          countReleased: [],
          countSuspended: [],
        }
      );
      //* /

      this.chartOptions = {
        chart: {
          type: 'column',
        },
        title: {
          text: 'Etat du parc',
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
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
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
            name: 'Stock',
            data: dataSeries.countStock,
          },
          {
            name: 'Pré-activé',
            data: dataSeries.countPreactivated,
          },
          {
            name: 'Test',
            data: dataSeries.countTest,
          },
          {
            name: 'Activé',
            data: dataSeries.countActivated,
          },
          {
            name: 'Suspendu',
            data: dataSeries.countSuspended,
          },
          {
            name: 'Résilié',
            data: dataSeries.countReleased,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
