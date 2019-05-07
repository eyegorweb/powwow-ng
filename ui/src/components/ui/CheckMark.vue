<template>
  <div
    class="circle-loader animated-checkmark"
    :class="{
      'load-complete': !isLoading,
      'is-error': isError,
      'can-pulse': pulse,
      loading: isLoading,
      disabled: !checked,
    }"
  >
    <div
      :class="{
        checked: checked && !isLoading && !isError,
        checkmark: checked && !isError,
        cross: isError,
        animate: animate,
      }"
    />
  </div>
</template>

<script>
export default {
  name: 'CheckMark',
  props: {
    isLoading: Boolean,
    isError: Boolean,
    pulse: Boolean,
    animate: Boolean,
    checked: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped>
$loader-size: 1.5em;
$check-height: $loader-size/2;
$check-width: $check-height/2;
$check-left: $loader-size/6;
$check-thickness: 2px;
$check-color: $success;

.circle-loader {
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-left-color: $secondary;
  position: relative;
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
  width: $loader-size;
  height: $loader-size;
  margin-top: $loader-size / 5;
  box-shadow: 0 0 0 rgba(204, 169, 44, 0.4);

  &.loading {
    animation: loader-spin 1.2s infinite linear;
  }
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.load-complete {
  &.can-pulse {
    animation: pulse-success 1s;
  }
  border-color: $check-color;
  background-color: $check-color;
  border-width: 1px;
  transition: border 500ms ease-out;

  &.disabled {
    border-color: $medium-gray;
    background-color: transparent;
  }

  &.is-error {
    &.can-pulse {
      animation: pulse-error 1s !important;
    }

    border-color: $orange;
    background-color: $orange;
    transition: none;
  }
}

@keyframes pulse-success {
  0% {
    box-shadow: 0 0 0 0 rgba(5, 208, 166, 0.8);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(5, 208, 166, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(5, 208, 166, 0);
  }
}

@keyframes pulse-error {
  0% {
    box-shadow: 0 0 0 0 rgba(234, 91, 15, 0.8);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(234, 91, 15, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(234, 91, 15, 0);
  }
}

.checkmark {
  display: none;

  &.checked {
    display: block;
  }
  &:after {
    opacity: 1;
    height: $check-height;
    width: $check-width;
    transform-origin: left top;
    border-right: $check-thickness solid white;
    border-top: $check-thickness solid white;
    content: '';
    left: $check-left;
    top: $check-height;
    position: absolute;
    transform: scaleX(-1) rotate(135deg);
  }
  &.animate:after {
    animation-duration: 1.5s;
    animation-timing-function: ease;
    animation-name: checkmark-anim;
  }
}

@keyframes checkmark-anim {
  0% {
    height: 0;
    width: 0;
    opacity: 1;
  }
  20% {
    height: 0;
    width: $check-width;
    opacity: 1;
  }
  40% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
  100% {
    height: $check-height;
    width: $check-width;
    opacity: 1;
  }
}

.cross {
  $cross-size: $loader-size / 2;

  height: $cross-size;
  width: $cross-size;

  &:before,
  &:after {
    position: absolute;
    left: 0.55rem;
    top: $cross-size / 2;
    content: ' ';
    height: $cross-size;
    width: 2px;
    background-color: white;
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
</style>
