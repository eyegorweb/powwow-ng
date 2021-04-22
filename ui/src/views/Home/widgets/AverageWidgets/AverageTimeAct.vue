<template>
  <div>
    <AverageIndicators
      :widget="widget"
      :period="period"
      :update-content-type="updateContentType"
      :indicators="indicators"
      :context-filters="contextFilters"
      :no-results="noResults"
      :toggle-values="toggleValues"
    />
    <div v-if="lastUpdateDate" class="update-date">
      {{ $t('lastUpdate') }}: {{ lastUpdateDate }}
    </div>
  </div>
</template>

<script>
import AverageIndicators from './AverageIndicators';
import { fetchPrecalculatedIndicators } from '@/api/indicators.js';
import { mapState } from 'vuex';

const defaultTimeUnit = 'h';

export default {
  components: {
    AverageIndicators,
  },
  props: {
    widget: Object,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    noResults() {
      return this.indicators && !this.indicators.length ? true : false;
    },
  },
  async mounted() {
    await this.refreshIndicatorsForPeriod();
  },
  data() {
    return {
      indicators: undefined,
      period: 'DAY',
      contextFilters: [],
      lastUpdateDate: undefined,
      partners: [],
      toggleValues: [
        {
          id: 'day',
          label: 'day',
          default: this.period === 'DAY',
        },
        {
          id: 'month',
          label: 'month',
          default: this.period === 'MONTH',
        },
        {
          id: 'quarter',
          label: 'quarter',
          default: this.period === 'QUARTER',
        },
      ],
    };
  },
  methods: {
    async updateContentType(newVal) {
      this.period = newVal.id.toUpperCase();
      await this.refreshIndicatorsForPeriod();
    },
    async refreshIndicatorsForPeriod() {
      if (this.contextPartners) {
        this.partners = this.contextPartners.map((p) => p.id);
      }
      const listIndicators = await fetchPrecalculatedIndicators(
        [
          `${'ACT_DELAY_ACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_PREACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_SUSPENDION_'}${this.period}`,
          `${'ACT_DELAY_SERVICE_CHANGE_'}${this.period}`,
          `${'ACT_DELAY_ICCID_CHANGE_'}${this.period}`,
        ],
        this.partners,
        this.contextPartnersType
      );

      this.indicators = listIndicators
        .map((i) => {
          const labelKey = this.averageTimeAction(i.name);
          return {
            total: i.numberValue,
            clickable: false,
            labelKey,
            id: i.name,
            unit: defaultTimeUnit,
            linked: false,
          };
        })
        .sort((a, b) => {
          if (a.labelKey < b.labelKey) {
            return -1;
          }
          if (a.labelKey > b.labelKey) {
            return 1;
          }
          return 0;
        });
    },
    getLabel(name, from, to) {
      return name.slice(from, to);
    },
    averageTimeAction(label) {
      const action = this.getLabel(label, 'act_delay_'.length, label.lastIndexOf('_'));
      let value;
      switch (action) {
        case 'ACTIVATION':
          value = this.$t('getparc.actTypes.ACTIVATION');
          break;

        case 'PREACTIVATION':
          value = this.$t('getparc.actTypes.PREACTIVATION');
          break;

        case 'SUSPENDION':
          value = this.$t('getparc.actTypes.SUSPENDION');
          break;

        case 'SERVICE_CHANGE':
          value = this.$t('getparc.actTypes.SERVICE_CHANGE');
          break;

        case 'ICCID_CHANGE':
          value = this.$t('getparc.actTypes.ICCID_CHANGE');
          break;

        default:
          value = label;
      }
      return value;
    },
  },
  watch: {
    async contentType() {
      return await fetchPrecalculatedIndicators(
        [
          `${'ACT_DELAY_ACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_PREACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_SUSPENDION_'}${this.period}`,
          `${'ACT_DELAY_SERVICE_CHANGE_'}${this.period}`,
          `${'ACT_DELAY_ICCID_CHANGE_'}${this.period}`,
        ],
        this.partners,
        this.contextPartnersType
      );
    },
    async contextPartners() {
      await this.refreshIndicatorsForPeriod();
    },
    async contextPartnersType() {
      await this.refreshIndicatorsForPeriod();
    },
  },
};
</script>

<style lang="scss" scoped></style>
