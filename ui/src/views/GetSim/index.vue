<template>
  <div class="mt-4">
    <div class="row mb-0">
      <div class="col-md-9">
        <h4>
          <b>GetSim</b>
          - {{ $t('getsim.manage-orders') }}
          <Tooltip direction="right">{{ $t('getsim.tooltip-text') }}</Tooltip>
        </h4>
      </div>
    </div>

    <UiTabs v-if="tabs" :tabs="tabs">
      <template slot-scope="{ tab, index }">
        <UiTab
          v-if="tab"
          :is-selected="index === currentTabToShow"
          :disable-menu="tab.disable"
          class="tab-grow"
        >
          <router-link :to="tab.to">{{ tab.title }}</router-link>
        </UiTab>
      </template>
    </UiTabs>

    <div class="pt-4 pl-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

export default {
  name: 'GetSim',

  components: {
    Tooltip,
    UiTabs,
    UiTab,
  },

  data() {
    return {
      tabs: undefined,
    };
  },

  computed: {
    currentTabToShow() {
      if (this.$route.name.includes('reservations')) return 1;
      return 0;
    },
  },

  methods: {
    initTabs() {
      this.tabs = [
        {
          label: 'orders',
          title: this.$t('home.widgets.orders'),
          to: {
            name: 'orders.search',
          },
        },
        {
          label: 'reservasions',
          title: this.$t('getsim.reservasions.tabTitle'),
          to: {
            name: 'orders.reservations',
          },
        },
      ];
    },
  },

  mounted() {
    if (this.$shouldShowMocks) {
      this.initTabs();
    }
  },
};
</script>
