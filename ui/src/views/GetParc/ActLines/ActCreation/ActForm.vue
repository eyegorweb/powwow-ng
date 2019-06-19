<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
      <ReactivateForm v-if="act.title === 'getparc.actCreation.carouselItem.REACTIVATE'" />
      <SuspendLinesForm v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';
import ReactivateForm from './forms/ReactivateForm';
import SuspendLinesForm from './forms/SuspendLinesForm';

export default {
  components: {
    ChangeServiceForm,
    ReactivateForm,
    SuspendLinesForm,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
