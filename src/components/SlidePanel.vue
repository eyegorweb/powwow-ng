<template>
  <div>
    <div
      class="cd-panel cd-panel--from-right js-cd-panel-main"
      :class="{ 'cd-panel--is-visible': isOpen, 'wide': wide, 'narrow': !wide}"
    >
      <header class="cd-panel__header">
        <h1>{{ $t(title) }}</h1>

        <a
          href="#0"
          class="cd-panel__close js-cd-close"
          @click.prevent="$emit('close')"
        >Close</a>
      </header>

      <div class="cd-panel__container">
        <div class="cd-panel__content">
          <slot />
        </div>
        <slot class="cd-panel__footer" name="footer" />
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'SlidePanel',
  props: {
    title: String,
    isOpen: Boolean,
    wide: Boolean,
  },
};
</script>

<style lang="scss">
.cd-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  visibility: hidden;

  transition: visibility 0s 0.6s;
  &::after {
    /* overlay layer */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    cursor: pointer;
    transition: background 0.3s 0.3s;
  }
  &.cd-panel--is-visible {
    visibility: visible;
    transition: visibility 0s 0s;
    &::after {
      background: rgba(0, 0, 0, 0.6);
      transition: background 0.3s 0s;
    }
  }
}

.cd-panel__header {
  position: fixed;
  width: 90%;
  background: white;
  z-index: 2;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s 0s;
  transform: translateY(-4em);
  h1 {
    padding: 0.6em;
    font-size: 1.25rem;
  }
}

.cd-panel--from-right .cd-panel__header {
  right: 0;
}

.cd-panel--from-left .cd-panel__header {
  left: 0;
}

.cd-panel--is-visible .cd-panel__header {
  transition: transform 0.3s 0.3s;
  transform: translateY(0px);
}

.cd-panel__close {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 60px;
  /* image replacement */
  display: inline-block;
  overflow: hidden;
  text-indent: 100%;
  white-space: nowrap;
  &::before,
  &::after {
    /* close icon created in CSS */
    content: '';
    position: absolute;
    top: 22px;
    left: 20px;
    height: 3px;
    width: 20px;
    background-color: #424f5c;
    /* this fixes a bug where pseudo elements are slighty off position */
    backface-visibility: hidden;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
  &:hover {
    background-color: #424f5c;
    &::before,
    &::after {
      background-color: #ffffff;
      transition: transform 0.3s;
    }
    &::before {
      transform: rotate(220deg);
    }
    &::after {
      transform: rotate(135deg);
    }
  }
}

.cd-panel--is-visible .cd-panel__close {
  &::before {
    animation: cd-close-1 0.6s 0.3s;
  }
  &::after {
    animation: cd-close-2 0.6s 0.3s;
  }
}

@-webkit-keyframes cd-close-1 {
  0%,
  50% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(45deg);
  }
}

@keyframes cd-close-1 {
  0%,
  50% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(45deg);
  }
}

@-webkit-keyframes cd-close-2 {
  0%,
  50% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-45deg);
  }
}

@keyframes cd-close-2 {
  0%,
  50% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-45deg);
  }
}

.cd-panel__container {
  position: fixed;
  width: 90%;
  height: 100%;
  top: 0;
  background: #f3f3f3;
  z-index: 1;
  transition: transform 0.3s 0.3s;
}

.cd-panel--from-right .cd-panel__container {
  right: 0;
  transform: translate3d(100%, 0, 0);
}

.cd-panel--from-left .cd-panel__container {
  left: 0;
  transform: translate3d(-100%, 0, 0);
}

.cd-panel--is-visible .cd-panel__container {
  transform: translate3d(0, 0, 0);
  transition-delay: 0s;
}

.cd-panel__content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  p {
    font-size: 1.4rem;
    color: #424f5c;
    line-height: 1.4;
    margin: 2em 0;
    &:first-of-type {
      margin-top: 0;
    }
  }
}

@media only screen and (min-width: 768px) {
  .cd-panel__content p {
    font-size: 1.6rem;
    line-height: 1.6;
  }
}

.cd-panel__footer {
  color: black;
}

@media only screen and (min-width: 768px) {
  .wide {
    .cd-panel__header {
      width: 70%;
    }
    .cd-panel__container {
      width: 70%;
    }
  }
  .narrow {
    .cd-panel__header {
      width: 50%;
    }
    .cd-panel__container {
      width: 50%;
    }
  }
}

@media only screen and (min-width: 1170px) {
  .wide {
    .cd-panel__header {
      width: 50%;
    }
    .cd-panel__container {
      width: 50%;
    }
  }
  .narrow {
    .cd-panel__header {
      width: 30%;
    }
    .cd-panel__container {
      width: 30%;
    }
  }
}

.cd-panel__footer {
  position: absolute;
  bottom: 0;
  height: 10%;
  width: 100%;
}
</style>
