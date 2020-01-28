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
import { fetchEntitiesIndicators } from '@/api/indicators.js';

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
      period: 'DATA',
      contextFilters: [],
      specificMessage: undefined,
      toggleValues: [
        {
          id: 'data',
          label: 'Data',
          default: this.period === 'DATA',
        },
        {
          id: 'sms',
          label: 'SMS',
          default: this.period === 'SMS',
        },
        {
          id: 'voice',
          label: 'Voice',
          default: this.period === 'VOICE',
        },
      ],
    };
  },
  computed: {
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
      const listTopIndicators = await fetchEntitiesIndicators(
        [`LINE_CONSUMPTION_${this.period}`],
        ...this.contextFilters
      );

      this.indicators = listTopIndicators.map((i, index) => {
        return {
          total: i.numberValue,
          clickable: true,
          labelKey: i.partyName,
          id: `${i.name}_${index}`,
          // id: i.name,
          entityId: i.entityId,
          stringValue: i.stringValue,
          linked: true,
        };
      });
      this.displayInfoMessage();
    },
    displayInfoMessage() {
      if (this.noResults) return;
      if (this.indicators && this.indicators.length && this.indicators.length < 5) {
        this.specificMessage = this.$t('home.widgets.message.activation');
      } else {
        this.specificMessage = '';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
