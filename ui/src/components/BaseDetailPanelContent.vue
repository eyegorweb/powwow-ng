<template>
  <div class="panel-vertical-container" :class="{ 'bg-white': white }">
    <div
      class="data-detail-container"
      ref="panelMainContainer"
      :class="{ 'main-content': !main }"
      @scroll="$emit('scroll', $refs.panelMainContainer)"
    >
      <slot></slot>
      <div>
        <slot name="error"></slot>
      </div>
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

.panel-vertical-container {
  overflow-y: scroll;

  @media only screen and (max-width: 1024px) {
    width: 100%;
  }
}

.footer-panel-buttons {
  position: absolute;
  z-index: 1;
  width: 100%;
  bottom: 0;
  background: white;
  box-shadow: 1px -8px 18px -9px rgba(0, 0, 0, 0.27);

  .action-buttons {
    display: flex;
    justify-content: space-between;
    padding-right: 10px;
    padding: 10px 0;

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
