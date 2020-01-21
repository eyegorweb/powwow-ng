<template>
  <WidgetBloc :widget="widget">
    <Toggle
      v-if="toggleValues"
      @update="updateContentType"
      :values="toggleValues"
      class="pl-2"
      slim-toggles
      block
    />
    <ul v-if="!noResults" class="list-group bg-white">
      <li
        class="list-group-item"
        v-for="indicator in indicators"
        :key="indicator.name + indicator.labelKey"
      >
        {{ $t(averageTimeAction(indicator.labelKey)) }}
        <div class="float-right">
          <button class="btn btn-link p-0" :disabled="true">
            <span>{{ indicator.total }} {{ indicator.unit }}</span>
          </button>
        </div>
      </li>
      <li v-if="infoMessage" class="list-group-item">
        <em>{{ infoMessage }}</em>
      </li>
    </ul>
    <div v-else class="noResult alert-light" role="alert">{{ $t('noResult') }}</div>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';
import Toggle from '@/components/ui/UiToggle2';

export default {
  components: {
    WidgetBloc,
    Toggle,
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
    noResults: Boolean,
  },
  methods: {
    getLabel(name, from, to) {
      return name.slice(from, to);
    },
    averageTimeAction(label) {
      const action = this.getLabel(label, 'act_delay_'.length, label.lastIndexOf('_'));
      if (action === 'ACTIVATION') {
        return 'getparc.actTypes.ACTIVATION';
      }
      if (action === 'PREACTIVATION') {
        return 'getparc.actTypes.PREACTIVATION';
      }
      if (action === 'SUSPENDION') {
        return 'getparc.actTypes.SUSPENDION';
      }
      if (action === 'SERVICE_CHANGE') {
        return 'getparc.actTypes.SERVICE_CHANGE';
      }
      if (action === 'ICCID_CHANGE') {
        return 'getparc.actTypes.ICCID_CHANGE';
      }
    },
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

<style lang="scss" scoped>
li {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.125);
  font-size: 0.8rem;
  padding-bottom: 0.4rem;
  &:first-child {
    border-top: none;
  }
}
.noResult {
  padding: 0.75rem 0.5rem;
}
</style>
