<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
      <ReactivateForm v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'" />
      <SuspendLinesForm v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'" />
      <SendSMSForm v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS'" />
      <TestPhaseForm v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE'" />
      <EditCustomFieldsForm v-if="act.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS'" />
      <TransfertLines v-if="act.title === 'getparc.actCreation.carouselItem.TRANSFERT_LINES'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';
import ReactivateForm from './forms/ReactivateForm';
import SuspendLinesForm from './forms/SuspendLinesForm';
import SendSMSForm from './forms/SendSMSForm';
import TestPhaseForm from './forms/TestPhaseForm';
import EditCustomFieldsForm from './forms/EditCustomFieldsForm';
import TransfertLines from './forms/TransfertLines';

export default {
  components: {
    ChangeServiceForm,
    ReactivateForm,
    SuspendLinesForm,
    SendSMSForm,
    TestPhaseForm,
    EditCustomFieldsForm,
    TransfertLines,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
