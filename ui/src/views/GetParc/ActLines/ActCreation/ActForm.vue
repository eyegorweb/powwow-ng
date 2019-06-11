<template>
  <div class="row mb-3">
    <div class="col-md-12">
      <ChangeServiceForm v-if="act.title === 'getparc.actCreation.carouselItem.CHANGE_SERVICES'" />
    </div>
  </div>
</template>

<script>
import ChangeServiceForm from './forms/ChangeServiceForm';

export default {
  components: {
    ChangeServiceForm,
  },
  props: {
    act: Object,
  },
};
</script>

<style lang="scss" scoped></style>
