<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>{{ $t('mainMenu.getAlarm') }}</b>
          - {{ $t('getvsion.manage-alarms') }}
          <Tooltip direction="right">{{ $t('getvsion.manage-alarms-tooltip') }}</Tooltip>
        </h4>
      </div>
    </div>
    <div class="mt-4 mb-4">
      <UiTabs :tabs="tabs" :selected-index="currentTab">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a href="#" @click.prevent="() => (currentTab = index)">{{ $t(tab.title) }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="parcAlarms">
          <ParcAlarmsTab
            :key="'parcAlarms'"
            :api-fn="searchAlarms"
            @currentFiltersChange="setCurrentFilters"
            :init-filters="currentFilters"
            :alarm-type="'ALARM'"
          />
        </div>
        <div class="pt-4 pl-4" slot="cockpitM2M">M2M</div>
        <div class="pt-4 pl-4" slot="alarmsSharedConso">
          <ParcAlarmsTab
            :key="'alarmsSharedConso'"
            :api-fn="searchSharedConsoAlarms"
            m2m
            @currentFiltersChange="setCurrentFilters"
            :init-filters="currentFilters"
            :alarm-type="'SHARED_CONSO_ALARM'"
          />
        </div>
      </UiTabs>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import ParcAlarmsTab from './ParcAlarmsTab';
import { excludeMocked } from '@/featureFlipping/plugin.js';
import { searchAlarms, searchSharedConsumptionAlarm } from '@/api/alarms';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    Tooltip,
    UiTabs,
    UiTab,
    ParcAlarmsTab,
  },
  data() {
    return {
      prevRoute: undefined,
      currentTab: 0,
      tabs: [],
    };
  },
  mounted() {
    this.tabs = excludeMocked([
      {
        label: 'parcAlarms',
        title: 'getvsion.tab-1-parc-alarms',
      },
      {
        label: 'cockpitM2M',
        title: 'getvsion.tab-2-m2m-alarms',
        mock: true,
      },
      {
        label: 'alarmsSharedConso',
        title: 'getvsion.tab-3-m2m-sharedconso',
      },
    ]).filter((i) => {
      if (this.userIsM2MLight) {
        return i.label === 'parcAlarms';
      }
      return true;
    });
  },
  computed: {
    ...mapGetters('alarms', ['currentFilters']),
    ...mapGetters(['userIsM2MLight']),
  },
  methods: {
    ...mapMutations('alarms', ['setCurrentFilters']),

    searchAlarms(orderBy, pagination, filters) {
      return searchAlarms(orderBy, pagination, filters);
    },
    searchSharedConsoAlarms(orderBy, pagination, filters) {
      return searchSharedConsumptionAlarm(orderBy, pagination, filters);
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-grow {
  flex-grow: 1;
}
a {
  text-transform: uppercase;
}
</style>
