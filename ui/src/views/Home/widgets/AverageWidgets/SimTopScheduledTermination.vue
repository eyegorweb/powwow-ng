<template>
  <AverageIndicators
    :widget="widget"
    :period="period"
    :update-content-type="updateContentType"
    :indicators="indicators"
    :context-filters="contextFilters"
    :info-message="specificMessage"
    :no-results="noResults"
    :toggle-values="toggleValues"
  />
</template>

<script>
import AverageIndicators from './AverageIndicators';
import { fetchPrecalculatedTopIndicators } from '@/api/indicators.js';
import { mapState } from 'vuex';

export default {
  components: {
    AverageIndicators,
  },
  props: {
    widget: Object,
  },
  async mounted() {
    await this.refreshIndicatorsForPeriod();
  },
  data() {
    return {
      indicators: undefined,
      period: 'DAY',
      contextFilters: [],
      specificMessage: undefined,
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
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    noResults() {
      return this.indicators && !this.indicators.length ? true : false;
    },
  },
  methods: {
    async updateContentType(newVal) {
      this.period = newVal.id.toUpperCase();
      await this.refreshIndicatorsForPeriod();
    },
    async refreshIndicatorsForPeriod() {
      let partners;
      if (this.contextPartners) {
        partners = this.contextPartners.map(p => p.id);
      }
      const listTopIndicators = await fetchPrecalculatedTopIndicators(
        [`SIM_TOP_SCHEDULED_TERMINATION_${this.period}`],
        partners,
        this.contextPartnersType
      );

      this.indicators = listTopIndicators.map((i, index) => {
        return {
          total: i.numberValue,
          clickable: false,
          labelKey: i.partyName,
          id: `${i.name}_${index}`,
          linked: false,
        };
      });
      this.displayInfoMessage();
    },
    displayInfoMessage() {
      if (this.noResults) return;
      if (this.indicators && this.indicators.length && this.indicators.length < 5) {
        this.specificMessage = this.$t('home.widgets.message.scheduleTermination');
      } else {
        this.specificMessage = '';
      }
    },
  },
  watch: {
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
