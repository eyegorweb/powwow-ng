<template>
  <GraphContainer
    title="getreport.dashboard.offerRepartition"
    :size="4"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
  >
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
import { getDoughnutOfferDistributionInfo } from '@/api/reportDashboard';
import { Chart } from 'highcharts-vue';

export default {
  components: {
    GraphContainer,
    Chart,
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

    showWarningMsg() {
      const billingAccountChosen = !!(this.billingAccount && this.billingAccount.id);
      const offerChosen = !!(this.offer && this.offer.id);
      if (billingAccountChosen || offerChosen) return true;
      return false;
    },
  },

  async mounted() {
    this.refreshData();
  },

  data() {
    return {
      chartOptions: undefined,
      tooltipMsg: this.$t('getdevice.messages.warning1'),
    };
  },

  methods: {
    async refreshData() {
      if (!this.partner) return;

      const data = await getDoughnutOfferDistributionInfo(
        this.partner.id,
        this.workflowCode,
        this.customerAccountId
      );
      const formateddata = data.reduce((all, item) => {
        all.push({
          name: item.offer,
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
            'Nombre de lignes: <b>{point.z}</b><br/>',
        },
        series: [
          {
            innerSize: '70%',
            zMin: 0,
            name: 'Offre',
            data: formateddata,
          },
        ],
        credits: {
          enabled: false,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
