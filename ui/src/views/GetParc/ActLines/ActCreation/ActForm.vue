<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES' && !isLoading"
      />
      <ReactivateForm
        v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE' && !isLoading"
      />
      <SuspendLinesForm
        v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND' && !isLoading"
      />
      <ChangeStatusForm
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_STATUS' && !isLoading"
      />
      <SendSMSForm v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS' && !isLoading" />
      <TestPhaseForm
        v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE' && !isLoading"
      />
      <EditCustomFieldsForm
        v-if="act.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS' && !isLoading"
      />
      <ManageCancellationForm
        v-if="act.title === 'getparc.actCreation.carouselItem.MANAGE_CANCELLATION' && !isLoading"
      />
      <TransfertLines
        v-if="act.title === 'getparc.actCreation.carouselItem.TRANSFERT_LINES' && !isLoading"
      />
      <ChangeBillingAccount
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_CF' && !isLoading"
      />
      <ChangeMSISDN
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_MSISDN' && !isLoading"
      />
      <ChangeICCID
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SIMCARD' && !isLoading"
      />
      <PreactivateActivate
        v-if="act.title === 'getparc.actCreation.carouselItem.ACTIVATE_PREACTIVATE' && !isLoading"
      />
      <ChangeOffer
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_OFFER' && !isLoading"
      />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm2';
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
import PreactivateActivate from './forms/PreactivateActivate';
import ChangeOffer from './forms/ChangeOffer';

import { mapGetters } from 'vuex';

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
    PreactivateActivate,
    ChangeOffer,
  },
  props: {
    act: Object,
  },
  computed: {
    ...mapGetters('actLines', ['isLoading']),
  },
};
</script>

<style lang="scss" scoped></style>
