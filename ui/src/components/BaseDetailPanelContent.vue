<template>
  <div class="panel-vertical-container">
    <div class="main-content data-detail-container">
      <slot></slot>
    </div>
    <div class="footer-panel-buttons">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {};
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

  .circle-loader {
    border: 3px solid rgba(0, 0, 0, 0.2);
    border-left-color: $secondary;
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: $loader-size;
    height: $loader-size;
  }
  .cross-loader {
    position: relative;
    display: inline-block;
    vertical-align: top;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    position: absolute;
    right: 20px;
  }

  .load-complete {
    border-color: $check-color;
    background-color: transparent;
    border-width: 1px;
    transition: border 500ms ease-out;
  }

  .cross {
    $cross-size: $loader-size / 2;

    height: $cross-size;
    width: $cross-size;
    position: absolute;
    right: 0;
    font-size: 24px;
    margin: -0.5rem 0 0 0;

    &:before,
    &:after {
      position: absolute;
      left: 0.55rem;
      top: $cross-size / 2;
      content: ' ';
      height: $cross-size;
      width: 2px;
      background-color: $success;
    }
    &:before {
      transform: rotate(45deg);
    }
    &:after {
      transform: rotate(-45deg);
    }
  }
}
</style>
