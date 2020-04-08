<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item mr-5">
        <h6>Informations générales</h6>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.name') }}:</h6>
        <p>{{ content.alarm.name }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
        <p>{{ content.sim.iccid }}</p>
      </div>

      <AlarmParameters :alarm="content.alarm" />
    </div>

    <TriggerHistorySkeleton v-if="isLoading" />
    <div class="overview-container m-3 bg-white" v-else-if="triggerHistory">
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.trigger-history') }}:</h6>
      </div>
      <div>
        <div v-for="item in triggerHistory.items" :key="item.id" class="overview-item mr-5">
          <AlarmHistoryItem :item="item" :alarm="content.alarm" />
        </div>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import AlarmParameters from './AlarmParameters';
import TriggerHistorySkeleton from './TriggerHistorySkeleton';
import AlarmHistoryItem from './AlarmHistoryItem';
import { fetchTriggerHistory } from '@/api/alarms';
import { getMonthString } from '@/utils/date';

export default {
  components: {
    BaseDetailPanelContent,
    AlarmParameters,
    AlarmHistoryItem,
    TriggerHistorySkeleton,
  },
  props: {
    /*
    {
      alarm: Object,
      sim: Object
    }
    */
    content: Object,
  },

  data() {
    return {
      triggerHistory: undefined,
      isLoading: false,
    };
  },

  async mounted() {
    this.isLoading = true;
    const triggerHistory = await fetchTriggerHistory(this.content.alarm.id);
    this.isLoading = false;

    if (triggerHistory) {
      const items = triggerHistory.items.map(element => {
        element.monthName =
          getMonthString(element.emissionDate)
            .charAt(0)
            .toUpperCase() + getMonthString(element.emissionDate).slice(1);
        return element;
      });

      triggerHistory.items = items;

      this.triggerHistory = triggerHistory;
    }
  },
};
</script>

<style lang="scss" scoped>
.data-detail-container .overview-container .overview-item {
  p {
    margin-bottom: 0.5rem;
  }
}
</style>
