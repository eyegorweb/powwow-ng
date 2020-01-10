<template>
  <BaseDetailPanelContent>
    <ChangeICCID
      v-if="content.title === 'getparc.actCreation.carouselItem.lineDetail.CHANGE_SIMCARD'"
      :line-data="content.lineData"
    />
    <ChangeMSISDN
      v-if="content.title === 'getparc.actCreation.carouselItem.lineDetail.CHANGE_MSISDN'"
      :line-data="content.lineData"
    />
    <ChangeCustomFields
      v-if="content.title === 'getparc.actCreation.carouselItem.lineDetail.CUSTOM_FIELDS'"
      :line-data="content.lineData"
    />
    <ChangeCustomerAccount
      v-if="content.title === 'getparc.actCreation.carouselItemlineDetail.CHANGE_CF'"
      :line-data="content.lineData"
    />
    <ChangeOffer
      v-if="content.title === 'getparc.actCreation.carouselItem.lineDetail.CHANGE_OFFER'"
      :line-data="content.lineData"
    />
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';

import ChangeICCID from './ChangeICCID';
import ChangeMSISDN from './ChangeMSISDN';
import ChangeCustomFields from './ChangeCustomFields';
import ChangeCustomerAccount from './ChangeCustomerAccount.vue';
import ChangeOffer from './ChangeOffer';

export default {
  props: {
    content: Object,
  },
  components: {
    BaseDetailPanelContent,
    ChangeICCID,
    ChangeMSISDN,
    ChangeCustomFields,
    ChangeCustomerAccount,
    ChangeOffer,
  },
};
</script>
<style lang="scss" scoped></style>
