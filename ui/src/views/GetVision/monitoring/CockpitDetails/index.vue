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
          <a href="#" @click.prevent="() => onChangeTab(index)">{{ tab.title }}</a>
        </UiTab>
      </template>

      <div class="pt-4 pl-4" slot="alerts">
        <UiButton variant="outline-primary" class="mb-4" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          Vue carte
        </UiButton>
        <CockpitAlerts :marker-data="markerData" :applied-filters="appliedFilters" />
      </div>
      <div class="pt-4 pl-4" slot="graphs">
        <CockpitGraphs :marker-data="markerData" :applied-filters="appliedFilters">
          <UiButton variant="outline-primary" class="mb-4" @click="$emit('gotomap')">
            <i class="ic-Pin-Icon"></i>
            Vue carte
          </UiButton>
        </CockpitGraphs>
      </div>
    </UiTabs>
  </div>
</template>

<script>
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import CockpitAlerts from './CockpitAlerts';
import CockpitGraphs from './CockpitGraphs';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    UiTabs,
    UiTab,
    CockpitAlerts,
    CockpitGraphs,
    UiButton,
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
  methods: {
    onChangeTab(index) {
      this.currentTab = index;
      this.$emit('tabchange', this.tabs[index]);
    },
  },
};
</script>

<style lang="scss" scoped></style>
