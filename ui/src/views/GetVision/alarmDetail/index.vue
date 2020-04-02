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

    <AlarmSummary v-if="alarm" :content="alarm" />

    <div v-if="alarm" class="mt-4">
      <UiTabs :tabs="tabs" :selected-index="currentTab">
        <template slot-scope="{ tab, index, selectedIndex }">
          <UiTab v-if="tab" :is-selected="index === selectedIndex" class="tab-grow">
            <a href="#" @click.prevent="() => (currentTab = index)"
              >{{ tab.title }}

              <span class="badge badge-primary">{{ tab.total }}</span>
            </a>
          </UiTab>
        </template>
        <div class="pt-4 pl-4 extra-space" slot="trigger2Month">
          <Trigger2MonthsTab :alarm="alarm" />
        </div>
        <div class="pt-4 pl-4 extra-space" slot="targetedLines">
          <TargetedLinesByAlarmTab :alarm="alarm" />
        </div>
        <div class="pt-4 pl-4 extra-space" slot="excludedSimFromAlarm">
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
import { fetchAlarmTriggersFor2Months, fetchLinesBoundToAlarm } from '@/api/alarmDetails';
import { mapMutations } from 'vuex';

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
          total: 0,
        },
        {
          label: 'targetedLines',
          title: this.$t('getvsion.alarm.triggered_lines'),
          total: 0,
        },
        {
          label: 'excludedSimFromAlarm',
          title: this.$t('getvsion.alarm.excluded_sim_from_alarms'),
          total: 0,
        },
      ],
      alarm: undefined,
    };
  },

  async mounted() {
    if (this.$route.params && this.$route.params.tabIndex) {
      this.currentTab = this.$route.params.tabIndex;
    }

    await this.refreshAlarm();
    if (this.$route.params && this.$route.params.editMode) {
      this.modifyAlarm();
    }
  },

  methods: {
    ...mapMutations(['openPanel']),

    async refreshAlarm() {
      this.alarm = await searchAlarmById(this.$route.params.alarmId);

      this.refreshTotals();
    },

    modifyAlarm() {
      const doReset = async () => {
        this.refreshAlarm();
      };
      this.openPanel({
        title: this.$t('getvsion.detail-panel.change-alarm'),
        panelId: 'getvsion.table.create-alarm',
        payload: { ...this.alarm, toModify: true },
        wide: true,
        backdrop: true,
        ignoreClickAway: true,
        onClosePanel(params) {
          if (params && params.resetSearch) {
            doReset();
          }
        },
      });
    },

    async refreshTotals() {
      const mandatoryFilters = [
        {
          id: 'filters.alarmId',
          value: this.alarm.id,
        },
      ];

      const lasTriggered = await fetchAlarmTriggersFor2Months(
        undefined,
        {
          page: 0,
          limit: 10,
        },
        mandatoryFilters
      );

      const linesBoundToAlarm = await fetchLinesBoundToAlarm(
        undefined,
        {
          page: 0,
          limit: 10,
        },
        mandatoryFilters
      );

      const excludedLinesFromAlarm = await fetchLinesBoundToAlarm(
        undefined,
        {
          page: 0,
          limit: 10,
        },
        [
          {
            id: 'filters.alarmId',
            value: this.alarm.id,
            notEqual: true,
          },
        ]
      );

      this.tabs = this.tabs.map(t => {
        if (t.label === 'trigger2Month') {
          t.total = lasTriggered.total;
        }

        if (t.label === 'targetedLines') {
          t.total = linesBoundToAlarm.total;
        }

        if (t.label === 'excludedSimFromAlarm') {
          t.total = excludedLinesFromAlarm.total;
        }

        return t;
      });
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

.back-btn {
  color: $gray-680;
}

.extra-space {
  margin-bottom: 20rem !important;
}
</style>
