<template>
  <GraphContainer
    title="getreport.dashboard.repartitionByZone"
    :size="4"
    :can-show="canShow"
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
      <chart v-if="chartOptions" :options="chartOptions" />
      <div class="centered-error" :style="{ minHeight: '400px' }" v-else>
        <div>
          {{ $t('noResult') }}
        </div>
      </div>
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import { doughnutAreaDistribution } from '@/api/reportDashboard';
import { Chart } from 'highcharts-vue';

export default {
  components: {
    Chart,
    GraphContainer,
  },

  props: {
    partner: Object,
    offer: Object,
    billingAccount: Object,
  },

  watch: {
    partner() {
      this.refreshData();
    },
  },
  computed: {
    workflowCode() {
      if (!this.offer) return;
      return this.offer.meta.code;
    },
    customerAccountId() {
      if (this.billingAccount && this.billingAccount.data) {
        return this.billingAccount.data.id;
      }
      return undefined;
    },
    canShow() {
      const partnerChosen = !!(this.partner && this.partner.id);
      if (partnerChosen) return true;
      return false;
    },
  },

  async mounted() {
    this.refreshData();
  },
  data() {
    return {
      isLoading: false,
      chartOptions: undefined,
    };
  },
  methods: {
    async refreshData() {
      if (!this.canShow) return;

      this.isLoading = true;
      const data = await doughnutAreaDistribution(
        this.partner.id,
        this.workflowCode,
        this.customerAccountId
      );
      this.isLoading = false;

      const formateddata = data.reduce((all, item) => {
        all.push({
          name: item.areaLabel,
          y: Math.round(item.percentage * 100) / 100,
          z: item.accessPointNumber,
        });
        return all;
      }, []);

      if (!formateddata.length) return;

      this.chartOptions = {
        chart: {
          type: 'variablepie',
        },
        title: {
          text: '',
        },
        tooltip: {
          headerFormat: '',
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> <b> {point.name} : {point.y} %</b><br/>' +
            this.$t('bills.lineTotal') +
            ': <b>{point.z}</b><br/>',
        },
        series: [
          {
            innerSize: '70%',
            zMin: 0,
            name: 'Zone',
            data: formateddata,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
