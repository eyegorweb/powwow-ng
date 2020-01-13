<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetVision</b>
          - {{ $t('getvsion.manage-alarms') }}
          <Tooltip direction="right">{{ $t('getvsion.manage-alarms-tooltip') }}</Tooltip>
        </h4>
      </div>
    </div>
    <div class="mt-4 mb-4">
      <ff-wip>
        <UiTabs :tabs="tabs" :selected-index="currentTab">
          <template slot-scope="{ tab, index, selectedIndex }">
            <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
              <a href="#" @click.prevent="() => (currentTab = index)">{{ tab.title }}</a>
            </UiTab>
          </template>
          <div class="pt-4 pl-4" slot="parcAlarms">
            <ParcAlarmsTab />
          </div>
          <div slot="cockpitM2M">M2M</div>
        </UiTabs>

        <template slot="orelse">
          <ParcAlarmsTab />
        </template>
      </ff-wip>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';

import ParcAlarmsTab from './ParcAlarmsTab';

export default {
  components: {
    Tooltip,
    UiTabs,
    UiTab,
    ParcAlarmsTab,
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          label: 'parcAlarms',
          title: this.$t('getvsion.tab-1-parc-alarms'),
        },
        {
          label: 'cockpitM2M',
          title: this.$t('getvsion.tab-2-m2m-alarms'),
        },
      ],
    };
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
