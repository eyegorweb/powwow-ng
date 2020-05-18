<template>
  <div class="panel-vertical-container" :class="{ 'bg-white': white }">
    <div class="data-detail-container" :class="{ 'main-content': !main }">
      <slot></slot>
    </div>
    <div class="footer-panel-buttons">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    white: Boolean,
    main: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.main-content {
  padding-bottom: 4vh;
}
</style>
<style lang="scss">
$fontSize: 0.8rem;
.footer-panel-buttons {
  padding: 0 1.25rem;
  .action-buttons {
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
    div {
      flex: 1;
      padding-left: 10px;
      padding-right: 10px;
    }
  }
}
.data-detail-container {
  $loader-size: 1.5em;
  $check-height: $loader-size/2;
  $check-width: $check-height/2;
  $check-left: $loader-size/6;
  $check-thickness: 2px;
  $check-color: $success;

  .overview-container {
    padding: 1rem 2rem;
    .overview-item {
      padding: 7px 10px 7px 0;
      border-bottom: 1px dashed $medium-gray;
      &:first-child {
        border-bottom: none;
      }
      &:last-child {
        border-bottom: none;
      }

      h4 {
        font-size: 0.875rem;
      }

      h6 {
        color: $gray-680;
        font-size: $fontSize;
        font-weight: 500;
      }

      p {
        font-size: $fontSize;
        margin: 0;
      }

      div {
        font-size: $fontSize;
      }
    }
  }
}
</style>
