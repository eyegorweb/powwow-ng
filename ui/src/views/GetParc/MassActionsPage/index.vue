<template>
  <div class="mt-4">
    <div class="row mb-0">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-act') }}
          <Tooltip direction="right">{{ $t('getparc.management-act-tooltip-text') }}</Tooltip>
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
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import Tooltip from '@/components/ui/Tooltip';
import { mapGetters } from 'vuex';

export default {
  components: {
    UiTabs,
    UiTab,
    Tooltip,
  },

  data() {
    return {
      tabs: undefined,
    };
  },

  computed: {
    currentTabToShow() {
      if (this.$route.name.includes('esim')) return 1;
      return 0;
    },
    ...mapGetters(['userHaveEsimEnabled']),
    ...mapGetters(['userInfos', 'havePermission']),
    canConsultEsim() {
      return this.userHaveEsimEnabled && this.havePermission('act', 'manage_esim');
    },
  },

  methods: {
    initTabs() {
      this.tabs = [
        {
          label: 'orders',
          title: this.$t('getparc.classic-acts'),
          to: {
            name: 'actHistory.classic',
            meta: { label: 'Historique des actes' },
          },
        },
        {
          label: 'esim',
          title: this.$t('getparc.esim-acts'),
          to: {
            name: 'actHistory.esim',
            meta: { label: 'Historique des actes eSIM' },
          },
        },
      ];
    },
  },

  mounted() {
    if (this.canConsultEsim) {
      this.initTabs();
    }
  },
};
</script>

<style lang="scss" scoped></style>
