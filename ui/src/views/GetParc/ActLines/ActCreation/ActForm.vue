<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
      <SuspendLinesForm v-if="act.title === 'getparc.actCreation.carouselItem.SUSPEND'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';
import SuspendLinesForm from './forms/SuspendLinesForm';

export default {
  components: {
    ChangeServiceForm,
    SuspendLinesForm,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
