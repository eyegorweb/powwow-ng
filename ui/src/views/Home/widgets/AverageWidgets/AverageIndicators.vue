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
      <li class="list-group-item" v-for="indicator in indicators" :key="indicator.id">
        <div v-if="indicator.linked">
          <a href="#" @click.prevent="onClick(indicator.entityId)">
            {{ indicator.stringValue }}
          </a>
          <div class="float-right">
            <button class="btn btn-link p-0" :disabled="true">
              <span>{{ formattedData(indicator.total) }}</span>
            </button>
          </div>
        </div>
        <div v-else>
          <span>{{ $t(averageTimeAction(indicator.labelKey)) }}</span>
          <div class="float-right">
            <button class="btn btn-link p-0" :disabled="true">
              <span>{{ indicator.total }} {{ indicator.unit }}</span>
            </button>
          </div>
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
import { formatBytes } from '@/api/utils';

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
    toggleValues: Array,
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
    onClick(id) {
      this.$router.push({
        name: 'lineDetail',
        params: { lineId: id, tabIndex: 1 },
      });
    },
    formattedData(value) {
      return formatBytes(value);
    },
  },
  data() {
    return {
      widgetVersion: 1,
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
