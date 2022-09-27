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
      <SuspendBillsForm
        v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND_BILLS' && !isLoading"
      />
      <ChangeStatusForm
        v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_STATUS' && !isLoading"
      />
      <SendSMSForm v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS' && !isLoading" />
      <TestPhaseForm
        v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE' && !isLoading"
      />
      <EditPartnerFieldsForm
        v-if="act.title === 'getparc.actCreation.carouselItem.CUSTOM_FIELDS' && !isLoading"
        :file-import-as-input-context="fileImportAsInputContext"
        :use-file-import-as-input="useFileImportAsInput"
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
      <PairingEsim
        v-if="act.title === 'getparc.actCreation.carouselItem.esim.PAIRING' && !isLoading"
      />
      <EsimFreeReservations
        v-if="act.title === 'getparc.actCreation.carouselItem.esim.FREE_RESERVATION' && !isLoading"
      />
      <EsimChangeProfile
        v-if="
          act.title === 'getparc.actCreation.carouselItem.esim.CHANGE_STATUS_PROFIL_ESIM' &&
            !isLoading
        "
      />
      <EsimAudit v-if="act.title === 'getparc.actCreation.carouselItem.esim.AUDIT' && !isLoading" />
      <EsimDownloadProfile
        v-if="
          act.title === 'getparc.actCreation.carouselItem.esim.DOWNLOAD_ESIM_PROFILE' && !isLoading
        "
      />
      <EsimPolicyRules
        v-if="act.title === 'getparc.actCreation.carouselItem.esim.POLICY_RULES' && !isLoading"
      />
      <ChargeLVOffers
        v-if="act.title === 'getparc.actCreation.carouselItem.esim.CHARGE_LV_LINES' && !isLoading"
      />
      <RechargeLinesOD
        v-if="act.title === 'getparc.actCreation.carouselItem.RECHARGE_LINES' && !isLoading"
        :total-selected="totalSelected"
      />
      <RadiusAdmin
        v-if="act.title === 'getparc.actCreation.carouselItem.RADIUS_ADMIN' && !isLoading"
      />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm2';
import ReactivateForm from './forms/ReactivateForm';
import SuspendLinesForm from './forms/SuspendLinesForm';
import SuspendBillsForm from './forms/SuspendBillsForm';
import ChangeStatusForm from './forms/ChangeStatusForm';
import SendSMSForm from './forms/SendSMSForm';
import TestPhaseForm from './forms/TestPhaseForm';
import EditPartnerFieldsForm from './forms/EditPartnerFieldsForm';
import ManageCancellationForm from './forms/ManageCancellationForm';
import TransfertLines from './forms/TransfertLines';
import ChangeBillingAccount from './forms/ChangeBillingAccount';
import ChangeMSISDN from './forms/ChangeMSISDN';
import ChangeICCID from './forms/ChangeICCID';
import PreactivateActivate from './forms/PreactivateActivate';
import ChangeOffer from './forms/ChangeOffer';
import PairingEsim from './forms/PairingEsim';
import EsimFreeReservations from './forms/EsimFreeReservations';
import EsimChangeProfile from './forms/EsimChangeProfile';
import EsimPolicyRules from './forms/EsimPolicyRules';
import EsimDownloadProfile from './forms/EsimDownloadProfile';
import EsimAudit from './forms/EsimAudit';
import RadiusAdmin from './forms/RadiusAdmin';

const ChargeLVOffers = () =>
  import('@/views/GetParc/ActLines/ActCreation/forms/ChargeLVOffers.vue');

const RechargeLinesOD = () =>
  import('@/views/GetParc/ActLines/ActCreation/forms/RechargeLinesOD.vue');

import { mapGetters } from 'vuex';

export default {
  components: {
    ChangeServiceForm,
    ReactivateForm,
    SuspendBillsForm,
    SuspendLinesForm,
    ChangeStatusForm,
    SendSMSForm,
    TestPhaseForm,
    EditPartnerFieldsForm,
    ManageCancellationForm,
    TransfertLines,
    ChangeBillingAccount,
    ChangeMSISDN,
    ChangeICCID,
    PreactivateActivate,
    ChangeOffer,
    PairingEsim,
    EsimFreeReservations,
    EsimChangeProfile,
    EsimDownloadProfile,
    ChargeLVOffers,
    RechargeLinesOD,
    EsimPolicyRules,
    EsimAudit,
    RadiusAdmin,
  },
  props: {
    act: Object,
    useFileImportAsInput: Boolean,
    totalSelected: Number,
    fileImportAsInputContext: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapGetters('actLines', ['isLoading']),
  },
};
</script>

<style lang="scss" scoped></style>
