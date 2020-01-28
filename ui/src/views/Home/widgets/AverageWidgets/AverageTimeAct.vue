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
import { isBefore } from '@/utils/date.js';

const defaultTimeUnit = 'h';

export default {
  components: {
    AverageIndicators,
  },
  props: {
    widget: Object,
  },
  computed: {
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
      const listIndicators = await fetchPrecalculatedIndicators(
        [
          `${'ACT_DELAY_ACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_PREACTIVATION_'}${this.period}`,
          `${'ACT_DELAY_SUSPENDION_'}${this.period}`,
          `${'ACT_DELAY_SERVICE_CHANGE_'}${this.period}`,
          `${'ACT_DELAY_ICCID_CHANGE_'}${this.period}`,
        ],
        ...this.contextFilters
      );

      this.indicators = listIndicators.map(i => {
        return {
          total: i.numberValue,
          clickable: false,
          labelKey: i.name,
          id: i.name,
          unit: defaultTimeUnit,
          linked: false,
        };
      });

      const ordered = this.indicators
        .filter(i => !!i.precalculatedValue)
        .sort((a, b) =>
          isBefore(a.precalculatedValue.updateDate, b.precalculatedValue.updateDate) ? -1 : 1
        );

      if (ordered.length) {
        this.lastUpdateDate = ordered[0].precalculatedValue.updateDate;
      }
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
