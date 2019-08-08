<template>
  <BaseDetailPanelContent>
    <ChangeICCID
      v-if="content.title === 'getparc.actCreation.carouselItem.CHANGE_SIMCARD'"
      :line-data="content.lineData"
    />
    <ChangeMSISDN
      v-if="content.title === 'getparc.actCreation.carouselItem.CHANGE_MSISDN'"
      :line-data="content.lineData"
    />
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';

import ChangeICCID from './ChangeICCID';
import ChangeMSISDN from './ChangeMSISDN';

export default {
  props: {
    content: Object,
  },
  components: {
    BaseDetailPanelContent,
    ChangeICCID,
    ChangeMSISDN,
  },
};
</script>

<style lang="scss" scoped></style>
