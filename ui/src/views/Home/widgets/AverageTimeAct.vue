<template>
  <WidgetBloc :widget="widget">
    <Toggle
      v-if="toggleValues"
      @update="updateContentType"
      :values="toggleValues"
      class="pl-2"
    ></Toggle>
    <Indicators
      :key="widgetVersion"
      v-if="indicators"
      :meta="indicators"
      :on-click="onCounterClick"
      no-borders
      small
      precalculated
    />
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import Toggle from '@/components/ui/UiToggle2';
import Indicators from '@/components/Indicators';
import { fetchPrecalculatedIndicators } from '@/api/indicators.js';

export default {
  components: {
    WidgetBloc,
    Toggle,
    Indicators,
  },
  props: {
    widget: Object,
    contextFilters: Array,
    starting: {
      type: String,
      default: 'DAY',
    },
  },
  mounted() {
    this.contentType = '' + this.starting;
    this.toggleValues = [
      {
        id: 'day',
        label: 'day',
        default: this.starting === 'DAY',
      },
      {
        id: 'month',
        label: 'month',
        default: this.starting === 'MONTH',
      },
      {
        id: 'quarter',
        label: 'quarter',
        default: this.starting === 'QUARTER',
      },
    ];
    this.indicators = [
      {
        labelKey: 'col.activationAsked',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actTypes',
            values: [{ id: 'ACTIVATION', label: this.$t('getparc.actTypes.ACTIVATION') }],
          },
        ],
        fetchKey: 'ACT_DELAY_ACTIVATION_DAY',
      },
      {
        labelKey: 'col.preActivationAsked',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actTypes',
            values: [
              {
                id: 'PREACTIVATION_ACTIVATION',
                label: this.$t('getparc.actTypes.PREACTIVATION_ACTIVATION'),
              },
            ],
          },
        ],
        fetchKey: 'ACT_DELAY_PREACTIVATION_DAY',
      },
      {
        labelKey: 'suspension',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actTypes',
            values: [{ id: 'STATUS_CHANGE', label: this.$t('getparc.actTypes.STATUS_CHANGE') }],
          },
          {
            id: 'filters.transitionName',
            value: 'suspendre',
          },
        ],
        fetchKey: 'ACT_DELAY_SUSPENDION_DAY',
      },
      {
        labelKey: 'getparc.actTypes.SERVICE_CHANGE',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actTypes',
            values: [{ id: 'SERVICE_CHANGE', label: this.$t('getparc.actTypes.SERVICE_CHANGE') }],
          },
        ],
        fetchKey: 'ACT_DELAY_SERVICE_CHANGE_DAY',
      },
      {
        labelKey: 'getparc.actTypes.ICCID_CHANGE',
        clickable: true,
        total: '-',
        filters: [
          {
            id: 'filters.actTypes',
            values: [{ id: 'ICCID_CHANGE', label: this.$t('getparc.actTypes.ICCID_CHANGE') }],
          },
        ],
        fetchKey: 'ACT_DELAY_ICCID_CHANGE_DAY',
      },
    ];
  },
  data() {
    return {
      contentType: undefined,
      toggleValues: undefined,
      indicators: undefined,
      widgetVersion: 1,
      period: 'DAY',
    };
  },
  methods: {
    updateContentType(newVal) {
      this.contentType = newVal.id.toUpperCase();
      this.period = this.contentType;
    },
    onCounterClick(indicator) {
      this.$router.push({
        name: 'actHistory',
        params: {
          queryFilters: [...indicator.filters, ...this.contextFilters],
        },
      });
    },
  },
  watch: {
    contextFilters() {
      this.widgetVersion += 1;
    },
    contentType() {
      this.indicators.map(async () => {
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
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
