<template>
  <div class="tabs">
    <ol class="tabs-bar d-flex justify-content-around pt-2">
      <slot
        :id="tab.label"
        v-for="(tab, i) in tabs"
        :index="i"
        :tab="tab"
        :selected-index="$selectedIndex"
        :select-tab="selectTab"
      >
        <Tab
          :key="tab.label"
          @selected="selectTab(i)"
          :is-selected="$selectedIndex === i"
        >{{ tab.label }}</Tab>
      </slot>
    </ol>
    <div class="tab-content">
      <slot :name="selectedTabName" />
    </div>
  </div>
</template>

<script>
import Tab from './Tab';
import { propWithDataFallback } from 'vue-prop-data-fallback';

export default {
  mixins: [propWithDataFallback('selectedIndex', null, null, { initialValue: 0 })],

  props: {
    tabs: {
      type: Array,
      required: true,
    },
  },

  computed: {
    selectedTabName() {
      // return default if the tab isn't good
      if (this.$selectedIndex < 0 || this.$selectedIndex >= this.tabs.length) return 'default';
      return this.tabs[this.$selectedIndex].label;
    },
  },

  methods: {
    selectTab(i) {
      this.$selectedIndex = i;
    },
  },

  components: { Tab },
};
</script>

<style scoped>
.tabs-bar {
  list-style: none;
  /* 14px */
  font-size: 0.875rem;
  margin-bottom: 0;
  padding-inline-start: 0;
}
</style>
