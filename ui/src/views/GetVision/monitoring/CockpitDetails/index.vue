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
        <CockpitAlerts :markerData="markerData" :appliedFilters="appliedFilters" />
      </div>
      <div class="pt-4 pl-4" slot="graphs">
        Graphs
      </div>
    </UiTabs>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import CockpitAlerts from './CockpitAlerts';

export default {
  components: {
    UiTabs,
    UiTab,
    CockpitAlerts
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
          label: 'alerts',
          title: 'Alertes',
        },
        /*
        {
          label: 'graphs',
          title: 'Graphiques',
        },
        //*/
      ]
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
