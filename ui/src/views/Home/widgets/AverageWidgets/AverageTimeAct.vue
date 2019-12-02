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
import { fetchPrecalculatedIndicators } from '@/api/indicators.js';

const defaultTimeUnit = 'h';

export default {
  components: {
    AverageIndicators,
  },
  props: {
    widget: Object,
  },
  mounted() {
    this.contentType = '' + this.period;
    this.indicators = [
      {
        labelKey: 'col.activationAsked',
        clickable: false,
        total: '-',
        unit: defaultTimeUnit,
        fetchKey: 'ACT_DELAY_ACTIVATION_DAY',
      },
      {
        labelKey: 'col.preActivationAsked',
        clickable: false,
        total: '-',
        unit: defaultTimeUnit,
        fetchKey: 'ACT_DELAY_PREACTIVATION_DAY',
      },
      {
        labelKey: 'suspension',
        clickable: false,
        total: '-',
        unit: defaultTimeUnit,
        fetchKey: 'ACT_DELAY_SUSPENDION_DAY',
      },
      {
        labelKey: 'getparc.actTypes.SERVICE_CHANGE',
        clickable: false,
        total: '-',
        unit: defaultTimeUnit,
        fetchKey: 'ACT_DELAY_SERVICE_CHANGE_DAY',
      },
      {
        labelKey: 'getparc.actTypes.ICCID_CHANGE',
        clickable: false,
        total: '-',
        unit: defaultTimeUnit,
        fetchKey: 'ACT_DELAY_ICCID_CHANGE_DAY',
      },
    ];
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
      return await fetchPrecalculatedIndicators(
        [
          `${'ACT_DELAY_ACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_PREACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_SUSPENDION_'}${this.period}`,
          `${'ACT_DELAY_SERVICE_CHANGE_'}${this.period}`,
          `${'ACT_DELAY_ICCID_CHANGE_'}${this.period}`,
        ],
        ...this.contextFilters
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
