<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item">
      <h4 class="font-weight-normal text-uppercase">
        {{ $t('getparc.actLines.details.upcommingChanges') }}
      </h4>
    </div>
    <div class="overview-item mr-5">
      <h6>01/01/2017 :</h6>
      <p>Changement 1 ...</p>
    </div>
    <div class="overview-item mr-5">
      <h6>01/01/2017 :</h6>
      <p>Changement 2 ...</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped></style>
