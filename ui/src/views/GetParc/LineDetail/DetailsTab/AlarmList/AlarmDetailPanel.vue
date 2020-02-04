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
        <p>{{ content.iccid }}</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content.alarm" />
      </div>
    </div>

    <div class="overview-container m-3 bg-white" v-if="triggerHistory && triggerHistory.items[0]">
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.trigger-history') }}:</h6>
      </div>
      <div>
        <div v-for="(item, index) in triggerHistory.items" :key="index" class="overview-item mr-5">
          <h6>{{ item.monthName }}</h6>
          <p>{{ item.emissionDate }}</p>
          <Thresholds :alarm="item.alarm" />
        </div>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import Thresholds from '@/components/Thresholds';
import { triggerHistory } from '@/api/alarms';
import { currentMonthString } from '@/utils/date';

export default {
  components: {
    BaseDetailPanelContent,
    Thresholds,
  },
  props: {
    content: Object,
  },

  data() {
    return {
      triggerHistory: undefined,
    };
  },

  async mounted() {
    this.triggerHistory = await triggerHistory(this.content.alarm.id);
    if (triggerHistory) {
      this.triggerHistory.items.forEach(element => {
        element.monthName =
          currentMonthString(element.emissionDate)
            .charAt(0)
            .toUpperCase() + currentMonthString(element.emissionDate).slice(1);
      });
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
