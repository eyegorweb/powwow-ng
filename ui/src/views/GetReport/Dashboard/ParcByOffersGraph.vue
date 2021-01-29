<template>
  <GraphContainer
    title="getreport.dashboard.offerRepartition"
    :size="4"
    :can-show="canShow"
    :warning="showWarningMsg"
    :tooltip-msg="tooltipMsg"
    skeletonHeight="400"
  >
    <div slot="onHide">
      {{ $t('getreport.errors.partnerRequired') }}
    </div>
    <div
      v-if="isLoading"
      class="skeleton-line error-txt"
      :style="{ width: '100%', height: '400px' }"
    ></div>
    <div :class="{ hidden: isLoading }">
      <chart v-if="chartOptions" :options="chartOptions" />
      <div class="error-txt" :style="{ minHeight: '400px' }" v-else>
        <div>
          {{ $t('noResult') }}
        </div>
      </div>
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
      if (this.billingAccount && this.billingAccount.data) {
        return this.billingAccount.data.id;
      }
      return;
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
      isLoading: false,
      chartOptions: undefined,
      tooltipMsg: this.$t('getdevice.messages.warning1'),
    };
  },

  methods: {
    async refreshData() {
      if (!this.partner) return;

      this.isLoading = true;

      const data = await getDoughnutOfferDistributionInfo(
        this.partner.id,
        this.workflowCode,
        this.customerAccountId
      );
      this.isLoading = false;

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
            this.$t('bills.lineTotal') +
            ': <b>{point.z}</b><br/>',
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

<style lang="scss" scoped>
.error-txt {
  font-size: 1.1rem;
  display: flex;
  align-content: center;
  flex-wrap: wrap;

  & > div {
    width: 100%;
    text-align: center;
  }
}
</style>
