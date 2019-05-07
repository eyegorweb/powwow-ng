<template>
  <div class="tooltip">
    <i class="ic-Info-Icon" />
    <div class="box">
      <div class="arrow-left"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
// TODO: gérer les différentes directions
export default {
  props: {
    direction: {
      type: String,
      default: 'right',
      validator(value) {
        return ['top', 'right', 'bottom', 'left'].indexOf(value) !== -1;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  display: inline;
  position: relative;

  .box {
    position: absolute;
    display: none;
    min-width: 400px;
    padding: 0.5rem;
    left: calc(100% + 10px);
    top: 0;
    z-index: 1;
    background-color: $white;
    font-size: 0.8rem;
    line-height: 1.5rem;
    box-shadow: 2px 2px 19px -8px rgba(69, 69, 69, 0.5);
  }

  &:hover {
    .box {
      display: block;
    }
  }

  .arrow-left {
    display: inline-block;
    position: absolute;
    top: 5px;
    left: -10px;
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-right: 10px solid $white;
  }
}
</style>
