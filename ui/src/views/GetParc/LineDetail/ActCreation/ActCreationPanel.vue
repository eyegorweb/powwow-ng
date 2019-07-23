<template>
  <BaseDetailPanelContent>
    <ChangeICCID
      v-if="content.title === 'getparc.actCreation.carouselItem.CHANGE_SIMCARD'"
      :line-data="content.lineData"
    />
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';

import ChangeICCID from './ChangeICCID';

export default {
  props: {
    content: Object,
  },
  components: {
    BaseDetailPanelContent,
    ChangeICCID,
  },
};
</script>

<style lang="scss" scoped></style>
