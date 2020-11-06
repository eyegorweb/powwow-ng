<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <div v-if="!singlePartner" class="alert-light">
      {{ $t('chooseAPartner') }}
    </div>
    <div v-else class="widget-header" slot="header">
      <Toggle
        v-if="toggleValues"
        @update="updateGraph"
        :values="toggleValues"
        slim-toggles
        class="pl-2"
      />
    </div>

    <template v-if="currentTab">
      <DataGraph v-if="currentTab.id === 'DATA'" />
      <SMSGraph v-if="currentTab.id === 'SMS'" />
      <VoiceGraph v-if="currentTab.id === 'VOICE'" />
    </template>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '../WidgetBloc';
import DataGraph from './DataGraph';
import SMSGraph from './SMSGraph';
import VoiceGraph from './VoiceGraph';
import Toggle from '@/components/ui/UiToggle2';
import { mapState } from 'vuex';

export default {
  name: 'ConsoGraphWidget',
  components: {
    WidgetBloc,
    DataGraph,
    SMSGraph,
    VoiceGraph,
    Toggle,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },

  methods: {
    updateGraph(newVal) {
      this.currentTab = newVal;
    },

    onSeeMore() {
      this.$router.push({
        name: 'reportsDashboard',
        params: {
          queryFilters: [...this.widgetFilters],
        },
      });
    },
  },

  computed: {
    ...mapState('getsim', ['defaultAppliedFilters']),

    widgetFilters() {
      const partnerFilter = [
        {
          id: 'filters.partners',
          values: this.singlePartner ? [this.singlePartner] : [],
        },
      ];
      return [...partnerFilter];
    },

    partners() {
      if (!this.defaultAppliedFilters) return [];

      return this.defaultAppliedFilters
        .filter(f => f.id === 'filters.partners')
        .map(f => f.values)
        .flat();
    },

    singlePartner() {
      return this.partners.length === 1 ? this.partners[0] : undefined;
    },
  },

  data() {
    return {
      currentTab: undefined,
      toggleValues: [
        {
          id: 'DATA',
          label: 'services.DATA',
          default: this.period === 'DATA',
        },
        {
          id: 'SMS',
          label: 'services.SMS',
          default: this.period === 'SMS',
        },
        {
          id: 'VOICE',
          label: 'services.VOICE',
          default: this.period === 'VOICE',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.widget-header {
  display: flex;
  width: 60%;
  justify-content: center;
}
</style>
