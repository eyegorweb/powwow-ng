<template>
  <div class="mt-4">
    <div class="row">
      <div class="col-md-9">
        <button @click.prevent="$router.go(-1)" class="btn btn-link back-btn">
          <i class="ic-Arrow-Previous-Icon" />
          {{ $t('back') }}
        </button>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetVision</b>
          - {{ $t('getvsion.manage-alarms') }}
        </h4>
      </div>
      <div class="col-md-3">
        <UiButton variant="primary" block class="float-right" @click="modifyAlarm()">
          <i class="select-icon ic-Amplifier-Icon" />
          {{ $t('getvsion.detail-panel.change-alarm') }}
        </UiButton>
      </div>
    </div>

    <AlarmSummary :content="alarm" />

    <div class="mt-4">
      <UiTabs :tabs="tabs" :selected-index="currentTab">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a href="#" @click.prevent="() => (currentTab = index)">{{ tab.title }}</a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4" slot="trigger2Month">
          <Trigger2MonthsTab :alarm="alarm" />
        </div>
        <div class="pt-4 pl-4" slot="targetedLines">
          <TargetedLinesByAlarmTab :alarm="alarm" />
        </div>
        <div class="pt-4 pl-4" slot="excludedSimFromAlarm">
          <ExcludedLinesFromAlarmTab :alarm="alarm" />
        </div>
      </UiTabs>
    </div>
  </div>
</template>

<script>
import UiButton from '@/components/ui/Button';
import UiTabs from '@/components/ui/Tabs';
import UiTab from '@/components/ui/Tab';
import AlarmSummary from './AlarmSummary';
import Trigger2MonthsTab from './Trigger2MonthsTab';
import TargetedLinesByAlarmTab from './TargetedLinesByAlarmTab';
import ExcludedLinesFromAlarmTab from './ExcludedLinesFromAlarmTab';

import { searchAlarmById } from '@/api/alarms';

export default {
  components: {
    UiButton,
    AlarmSummary,
    UiTabs,
    UiTab,
    Trigger2MonthsTab,
    TargetedLinesByAlarmTab,
    ExcludedLinesFromAlarmTab,
  },
  data() {
    return {
      currentTab: 0,
      tabs: [
        {
          label: 'trigger2Month',
          title: this.$t('getvsion.alarm.triggered_x_month', { month: 2 }),
        },
        {
          label: 'targetedLines',
          title: this.$t('getvsion.alarm.triggered_lines'),
        },
        {
          label: 'excludedSimFromAlarm',
          title: this.$t('getvsion.alarm.excluded_sim_from_alarms'),
        },
      ],
      alarm: {
        id: '1',
        name: 'UNDER_CONSUMPTION_VOLUME',
        type: 'UNDER_CONSUMPTION_VOLUME',
        alarmScope: 'LINE',
        observationCycle: 'CUSTOM',
        notifyByWs: false,
        notifyByEmail: true,
        mailingList: null,
        party: {
          id: '1',
          name: 'INGENICO',
        },
        numberOfTargetedLines: 2,
        numberOfTriggerEvents: 2,
        level1: 1,
        level1Up: null,
        level1Down: null,
        level2: 2,
        level2Up: null,
        level2Down: null,
        level3: 3,
        level3Up: null,
        level3Down: null,
      },
    };
  },

  async mounted() {
    this.alarm = await searchAlarmById(this.$route.params.alarmId);
  },

  methods: {
    modifyAlarm() {},
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

.back-btn {
  color: $gray-680;
}
</style>
