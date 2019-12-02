<template>
  <AverageIndicators
    :widget="widget"
    :period="period"
    :update-content-type="updateContentType"
    :indicators="indicators"
    :context-filters="contextFilters"
    :info-message="specificMessage"
  />
</template>

<script>
import AverageIndicators from './AverageIndicators';
import { fetchPrecalculatedTopIndicators } from '@/api/indicators.js';

export default {
  components: {
    AverageIndicators,
  },
  props: {
    widget: Object,
  },
  async mounted() {
    this.contentType = '' + this.period;
    const listTopIndicators = await fetchPrecalculatedTopIndicators(
      [`${'SIM_TOP_SCHEDULED_TERMINATION_'}${this.period}`],
      ...this.contextFilters
    );

    this.indicators = listTopIndicators.map(i => {
      return {
        total: i.numberValue,
        clickable: false,
        labelKey: i.partyName,
        fetchKey: i.name,
      };
    });

    this.displayInfoMessage();
  },
  data() {
    return {
      contentType: undefined,
      indicators: undefined,
      period: 'DAY',
      contextFilters: [],
      specificMessage: undefined,
    };
  },
  methods: {
    updateContentType(newVal) {
      this.contentType = newVal.id.toUpperCase();
      this.period = this.contentType;
    },
    displayInfoMessage() {
      if (!this.indicators.length) return;
      if (this.indicators.length && this.indicators.length < 5) {
        this.specificMessage = this.$t('home.widgets.message.scheduleTermination');
      }
    },
  },
  watch: {
    async contentType() {
      return await fetchPrecalculatedTopIndicators(
        [`${'SIM_TOP_SCHEDULED_TERMINATION_'}${this.period}`],
        ...this.contextFilters
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
