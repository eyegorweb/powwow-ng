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
      :info-message="infoMessage"
      no-borders
      small
      precalculated
    />
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';
import Toggle from '@/components/ui/UiToggle2';
import Indicators from '@/components/Indicators';

export default {
  components: {
    WidgetBloc,
    Toggle,
    Indicators,
  },
  props: {
    widget: Object,
    period: {
      type: String,
      default: 'DAY',
    },
    indicators: Array,
    updateContentType: Function,
    contextFilters: Array,
    infoMessage: String,
  },
  data() {
    return {
      widgetVersion: 1,
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
  watch: {
    contextFilters() {
      this.widgetVersion += 1;
    },
  },
};
</script>

<style lang="scss" scoped></style>
