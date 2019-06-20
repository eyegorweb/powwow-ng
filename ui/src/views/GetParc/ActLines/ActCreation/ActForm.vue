<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
      <ReactivateForm v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'" />
      <SuspendLinesForm v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'" />
      <SendSMSForm v-if="act.title === 'getparc.actCreation.carouselItem.SEND_SMS'" />
      <TestPhaseForm v-if="act.title === 'getparc.actCreation.carouselItem.TEST_PHASE'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';
import ReactivateForm from './forms/ReactivateForm';
import SuspendLinesForm from './forms/SuspendLinesForm';
import SendSMSForm from './forms/SendSMSForm';
import TestPhaseForm from './forms/TestPhaseForm';

export default {
  components: {
    ChangeServiceForm,
    ReactivateForm,
    SuspendLinesForm,
    SendSMSForm,
    TestPhaseForm,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
