<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <div class="overview-item mr-5">
        <h6>Informations générales</h6>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getparc.lineDetail.alarms.name') }}:</h6>
        <p>{{ content.name }}</p>
      </div>
      <div class="overview-item mr-5 mock-value">
        <h6>{{ $t('getparc.actDetail.col.iccid') }}:</h6>
        <p>1234</p>
      </div>
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.table.thresholds') }}:</h6>
        <Thresholds :alarm="content" />
      </div>
    </div>

    <div class="overview-container m-3 bg-white">
      <div class="overview-item mr-5">
        <h6>{{ $t('getvsion.alarm-detail') }}:</h6>
      </div>

      <div class="overview-item mr-5 mock-value">
        <h6>Mois en cours:</h6>
        <p>10/10/2018 15:45:22, Data Sortante : 3 Mo</p>
      </div>
      <div class="overview-item mr-5 mock-value">
        <h6>Novembre:</h6>
        <p>10/10/2018 15:45:22, Data Sortante : 3 Mo</p>
      </div>
      <div class="overview-item mr-5 mock-value">
        <h6>Octobre:</h6>
        <p>10/10/2018 15:45:22, Data Sortante : 3 Mo</p>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import Thresholds from '@/components/Thresholds';

export default {
  components: {
    BaseDetailPanelContent,
    Thresholds,
  },
  props: {
    content: Object,
  },
};
</script>

<style lang="scss" scoped></style>
