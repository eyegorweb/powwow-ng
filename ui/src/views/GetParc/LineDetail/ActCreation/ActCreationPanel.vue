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
    <ChangeCustomFields
      v-if="content.title === 'getparc.actCreation.carouselItem.lineDetail.CUSTOM_FIELDS'"
      :line-data="content.lineData"
    />
    <changeCustomerAccount
      v-if="content.title === 'getparc.actCreation.carouselItem.CHANGE_CF'"
      :line-data="content.lineData"
    />
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';

import ChangeICCID from './ChangeICCID';
import ChangeMSISDN from './ChangeMSISDN';
import ChangeCustomFields from './ChangeCustomFields';
import changeCustomerAccount from './changeCustomerAccount';

export default {
  props: {
    content: Object,
  },
  components: {
    BaseDetailPanelContent,
    ChangeICCID,
    ChangeMSISDN,
    ChangeCustomFields,
    changeCustomerAccount,
  },
};</script
><style lang="scss" scoped></style>
