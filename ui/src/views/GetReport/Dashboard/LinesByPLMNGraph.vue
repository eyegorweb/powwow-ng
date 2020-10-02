<template>
  <GraphContainer title="getreport.dashboard.plmnRepartition" :size="4" :can-show="canShow">
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div>
      <chart v-if="chartOptions" :options="chartOptions" />
      <div v-else>{{ $t('noResult') }}</div>
    </div>
  </GraphContainer>
</template>

<script>
import GraphContainer from './GraphContainer';
import { fetchPLMNDistribution } from '@/api/reportDashboard';
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
      if (!this.billingAccount) return;
      return this.billingAccount.data.id;
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
      chartOptions: undefined,
    };
  },

  methods: {
    async refreshData() {
      if (!this.canShow) return;

      const data = await fetchPLMNDistribution(
        this.partner.id,
        this.workflowCode,
        this.customerAccountId
      );
      const formateddata = data.reduce((all, item) => {
        all.push({
          name: item.plmn + '-' + item.operator,
          y: Math.round(item.percentage * 100) / 100,
          z: item.accessPointNumber,
        });
        return all;
      }, []);

      if (!formateddata.length) return;

      this.chartOptions = {
        credits: {
          enabled: false,
        },
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
            name: 'PLMN',
            data: formateddata,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
