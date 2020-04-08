<template>
  <div class="overview-container m-3 bg-white">
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.lineDetail.alarms.trigger-history') }}:</h6>
    </div>
    <div>
      <div class="overview-item mr-5">
        <div class="item">
          <div class="skeleton-line small"></div>
          <div class="skeleton-line"></div>
        </div>
        <div class="item">
          <div class="skeleton-line small"></div>
          <div class="skeleton-line"></div>
        </div>
        <div class="item">
          <div class="skeleton-line small"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.item {
  padding-bottom: 1.5rem;
  border-bottom: 1px dashed $medium-gray;

  .small {
    width: 8rem;
  }
}
</style>
