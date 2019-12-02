<template>
  <AverageIndicators
    :widget="widget"
    :period="period"
    :update-content-type="updateContentType"
    :indicators="indicators"
    :context-filters="contextFilters"
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
      [`${'SIM_TOP_TERMINATION_'}${this.period}`],
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
  },
  data() {
    return {
      contentType: undefined,
      indicators: undefined,
      period: 'DAY',
      contextFilters: [],
    };
  },
  methods: {
    updateContentType(newVal) {
      this.contentType = newVal.id.toUpperCase();
      this.period = this.contentType;
    },
  },
  watch: {
    async contentType() {
      return await fetchPrecalculatedTopIndicators(
        [`${'SIM_TOP_TERMINATION_'}${this.period}`],
        ...this.contextFilters
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
