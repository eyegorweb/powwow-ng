<template>
  <div>
    <UiTabs :tabs="tabs" :selected-index="currentTab">
      <template slot-scope="{ tab, index, selectedIndex }">
        <UiTab
          v-if="tab"
          :is-selected="index === selectedIndex"
          :disable-menu="tab.disable"
          class="tab-grow"
        >
          <a href="#" @click.prevent="() => (currentTab = index)">{{ tab.title }}</a>
        </UiTab>
      </template>
      <div class="pt-4 pl-4" slot="alerts">
        <CockpitAlerts :marker-data="markerData" :applied-filters="appliedFilters" />
      </div>
      <div class="pt-4 pl-4" slot="graphs">
        <h5>Data</h5>
        <CockpitGraphs :marker-data="markerData" :applied-filters="appliedFilters" />

        <h5>SMS</h5>
        <CockpitSmsGraph :marker-data="markerData" :applied-filters="appliedFilters" />

        <h5>Voix</h5>

        <CockpitVoiceGraph :marker-data="markerData" :applied-filters="appliedFilters" />
      </div>
    </UiTabs>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import CockpitAlerts from './CockpitAlerts';
import CockpitGraphs from './CockpitGraphs';
import CockpitSmsGraph from './CockpitSmsGraph';
import CockpitVoiceGraph from './CockpitVoiceGraph';

export default {
  components: {
    UiTabs,
    UiTab,
    CockpitAlerts,
    CockpitGraphs,
    CockpitSmsGraph,
    CockpitVoiceGraph,
  },
  props: {
    markerData: Object,
    appliedFilters: Array,
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          label: 'graphs',
          title: 'Graphiques',
        },
        {
          label: 'alerts',
          title: 'Alertes',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
