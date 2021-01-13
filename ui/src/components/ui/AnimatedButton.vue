<template>
  <a
    class="effect effect-2"
    :style="{ backgroundColor: backgroundColor }"
    @click.stop="$emit('click')"
    v-tooltip="tooltip"
  >
    <slot />
  </a>
</template>

<script>
export default {
  props: {
    backgroundColor: String,
    tooltip: {
      type: String,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
$link-text-color: #fff;
$border-radius: 6px;
$overlay-color: #fff;

.effect {
  background-color: $primary;

  text-align: center;
  display: inline-block;
  position: relative;
  text-decoration: none;
  color: $link-text-color;
  text-transform: capitalize;
  /* background-color: - add your own background-color */
  font: {
    size: 0.8rem;
  }
  padding-top: 4px;
  padding-bottom: 4px;
  width: 121px;
  border-radius: $border-radius;
  overflow: hidden;

  &:hover {
    cursor: pointer;
  }
}

.effect.effect-2 {
  transition: all 0.2s linear 0s;

  &:before {
    content: '\E90C';
    font-family: 'powwow' !important;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: -30px;
    width: 30px;
    height: 100%;
    background-color: rgba($overlay-color, 0.3);
    border-radius: 0px $border-radius $border-radius 0px;
    transition: all 0.2s linear 0s;
    text-align: center;
  }

  &:hover {
    text-indent: -30px;

    &:before {
      right: 0;
      text-indent: 0px;
    }
  }
}
</style>
