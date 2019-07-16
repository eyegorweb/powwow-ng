<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
      <ReactivateForm v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'" />
      <SuspendLinesForm v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'" />
      <ChangeStatusForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_STATUS'" />
      <SendSMSForm v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS'" />
      <TestPhaseForm v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE'" />
      <EditCustomFieldsForm v-if="act.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS'" />
      <ManageCancellationForm
        v-if="act.title === 'getparc.actCreation.carouselItem.MANAGE_CANCELLATION'"
      />
      <TransfertLines v-if="act.title === 'getparc.actCreation.carouselItem.TRANSFERT_LINES'" />
      <ChangeBillingAccount v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_CF'" />
      <ChangeMSISDN v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_MSISDN'" />
      <ChangeICCID v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SIMCARD'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';
import ReactivateForm from './forms/ReactivateForm';
import SuspendLinesForm from './forms/SuspendLinesForm';
import ChangeStatusForm from './forms/ChangeStatusForm';
import SendSMSForm from './forms/SendSMSForm';
import TestPhaseForm from './forms/TestPhaseForm';
import EditCustomFieldsForm from './forms/EditCustomFieldsForm';
import ManageCancellationForm from './forms/ManageCancellationForm';
import TransfertLines from './forms/TransfertLines';
import ChangeBillingAccount from './forms/ChangeBillingAccount';
import ChangeMSISDN from './forms/ChangeMSISDN';
import ChangeICCID from './forms/ChangeICCID';

export default {
  components: {
    ChangeServiceForm,
    ReactivateForm,
    SuspendLinesForm,
    ChangeStatusForm,
    SendSMSForm,
    TestPhaseForm,
    EditCustomFieldsForm,
    ManageCancellationForm,
    TransfertLines,
    ChangeBillingAccount,
    ChangeMSISDN,
    ChangeICCID,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
