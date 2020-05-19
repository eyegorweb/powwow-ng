<template>
  <GraphContainer
    title="Répartition du parc par zone"
    :size="4"
    :can-show="!!(partner && partner.id)"
  >
    <div>
      <chart v-if="chartOptions" :options="chartOptions" />
    </div>
    <div slot="onHide">{{ $t('getreport.errors.partnerRequired') }}</div>
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
      if (!this.billingAccount) return;
      return this.billingAccount.data.id;
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
      if (!this.partner) return;

      const data = await doughnutAreaDistribution(
        this.partner.id,
        this.workflowCode,
        this.customerAccountId
      );
      const formateddata = data.reduce((all, item) => {
        all.push({
          name: item.areaLabel,
          y: item.percentage,
          z: item.accessPointNumber,
        });
        return all;
      }, []);
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
            'Nombre de lignes: <b>{point.z}</b><br/>',
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
