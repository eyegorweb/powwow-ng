<template>
  <GraphContainer
    title="home.widgets.stateParc.title"
    :size="12"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
    skeleton-height="477"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div
      v-if="isLoading"
      class="skeleton-line centered-error"
      :style="{ width: '100%', height: '477px' }"
    ></div>
    <div :class="{ hidden: isLoading }">
      <div class="d-flex justify-content-end cy-export-parcState">
        <ExportButton :export-fn="getExportFn()"> </ExportButton>
      </div>
      <div class="d-flex justify-content-end">
        <Toggle
          v-if="toggleValues"
          @update="currentPeriod = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <chart v-if="chartOptions" :options="chartOptions" />
      <div class="centered-error" :style="{ minHeight: '477px' }" v-else>
        <div>
          {{ $t('noResult') }}
        </div>
      </div>
    </div>
  </GraphContainer>
</template>
<script>
import GraphContainer from './GraphContainer';
import { Chart } from 'highcharts-vue';
import { parcStatusByMonth } from '@/api/reportDashboard.js';
import Toggle from '@/components/ui/UiToggle2';
import { getMonthString } from '@/utils/date';
import ExportButton from '@/components/ExportButton';
import { parcStatusInfoExport } from '@/api/consumption.js';

export default {
  components: {
    ExportButton,
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
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await parcStatusInfoExport(this.partner.id, exportFormat, this.currentPeriod);
      };
    },

    async createGraph() {
      if (!this.canShow) return;

      const params = {
        partyId: this.partner.id,
      };

      if (this.billingAccount && this.billingAccount.data) {
        params.customerAccountCode = this.billingAccount.data.code;
      }

      this.isLoading = true;
      const apiData = await parcStatusByMonth(
        params.partyId,
        params.customerAccountCode,
        this.currentPeriod
      );
      this.isLoading = false;

      const dataSeries = apiData.reduce(
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

      // if (!dataSeries) return;

      this.chartOptions = {
        chart: {
          type: 'column',
        },
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
            '<td style="padding:0"><b>{point.y} ligne(s) </b></td></tr>',
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
            name: this.$t('getparc.actLines.commercialStatuses.stock'),
            data: dataSeries.countStock,
          },
          {
            name: this.$t('filters.actionValues.PREACTIVATED'),
            data: dataSeries.countPreactivated,
          },
          {
            name: this.$t('getparc.actLines.networkStatuses.TEST'),
            data: dataSeries.countTest,
          },
          {
            name: this.$t('filters.actionValues.ACTIVATED'),
            data: dataSeries.countActivated,
          },
          {
            name: this.$t('getparc.actLines.networkStatuses.SUSPENDED'),
            data: dataSeries.countSuspended,
          },
          {
            name: this.$t('getparc.actLines.networkStatuses.RELEASED'),
            data: dataSeries.countReleased,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
