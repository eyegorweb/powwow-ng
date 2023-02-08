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
          <router-link :to="tab.to">{{ $t(tab.label) }}</router-link>
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
import { mapGetters } from 'vuex';

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
    ...mapGetters(['userHaveEsimEnabled', 'havePermission']),
    currentTabToShow() {
      if (this.$route.name.includes('reservations')) return 1;
      return 0;
    },

    canOrderEsim() {
      return (
        this.userHaveEsimEnabled &&
        (this.havePermission('getSim', 'order_esim') ||
          this.havePermission('getParc', 'manage_esim'))
      );
    },
  },

  methods: {
    initTabs() {
      this.tabs = [
        {
          label: 'home.widgets.orders',
          to: {
            name: 'orders.search',
            meta: { label: 'Recherche de commandes' },
          },
        },
        {
          label: 'getsim.reservations.tabTitle',
          to: {
            name: 'orders.reservations',
            meta: { label: 'Recherche de réservations' },
          },
        },
      ];
    },
  },

  mounted() {
    if (this.canOrderEsim) {
      this.initTabs();
    }
  },
};
</script>
