<template>
  <GraphContainer
    title="Répartition du parc par PLMN"
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
      const offerChosen = !!(this.offer && this.offer.id);
      const billingAccountChosen = !!(this.billingAccount && this.billingAccount.id);

      return partnerChosen && !offerChosen && !billingAccountChosen;
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
            'Nombre de lignes: <b>{point.z}</b><br/>',
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
