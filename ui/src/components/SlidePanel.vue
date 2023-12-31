<template>
  <div>
    <div
      class="cd-panel cd-panel--from-right js-cd-panel-main"
      :class="{
        'cd-panel--is-visible': isOpen,
        wide: !width && wide,
        narrow: !width && !wide,
        'with-backdrop': backdrop,
      }"
      id="main-sliding-panel"
    >
      <header class="cd-panel__header" :style="{ width }">
        <h1 class="font-weight-light">{{ displayedTitle }}</h1>

        <a href="#0" class="cd-panel__close js-cd-close" @click.prevent="$emit('close')">Close</a>
      </header>

      <div class="cd-panel__container" :style="{ width }" v-clickaway="hidePanel">
        <div class="cd-panel__content">
          <slot />
        </div>
        <slot class="cd-panel__footer" name="footer" />
      </div>
    </div>
  </div>
</template>

<script>
import { clickaway } from '@/directives/clickaway';

export default {
  name: 'SlidePanel',
  props: {
    width: {
      type: String,
      required: false,
    },
    title: String,
    titleConf: Object,
    isOpen: Boolean,
    wide: Boolean,
    ignoreClickAway: Boolean,
    backdrop: {
      type: Boolean,
      default: true,
    },
  },
  directives: { clickaway },

  computed: {
    displayedTitle() {
      if (this.titleConf) {
        return this.$t(this.titleConf.key, this.titleConf.conf);
      }
      return this.title;
    },
  },

  watch: {
    isOpen(value) {
      if (this.backdrop) {
        if (value) {
          document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        } else {
          document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
      }
    },
  },
  methods: {
    hidePanel(e) {
      // pas la peine d ecacher un panel déjà caché
      if (!this.isOpen) return;

      if (this.backdrop && !this.ignoreClickAway) {
        // detecter le click dehors de la zone de contenu
        if (e.target.classList.contains('js-cd-panel-main')) {
          this.$emit('close');
        }
      } else {
        if (!this.ignoreClickAway) {
          this.$emit('close');
        }
      }
    },
  },
};
</script>

<style lang="scss">
.cd-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  visibility: hidden;

  transition: visibility 0s 0.6s;

  &::after {
    /* overlay layer */
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: transparent;
    cursor: pointer;
    transition: background 0.3s 0.3s;
  }

  &.with-backdrop {
    width: 100%;
    &::after {
      width: 100%;
    }
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
  z-index: 3;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s 0s, width 0.2s;
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
  width: 4rem;
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
    top: 1.5rem;
    left: 1.2rem;
    height: 0.3rem;
    width: 2rem;
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
  z-index: 2;
  transition: transform 0.3s 0.3s, width 0.2s linear;
  box-shadow: -5px -5px 19px rgba(0, 0, 0, 0.2);
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
    margin: 0.5em 0;
    &:first-of-type {
      margin-top: 0;
    }
  }
}

@media only screen and (min-width: 768px) {
  .cd-panel__content p {
    font-size: 0.85rem;
  }
}

.cd-panel__footer {
  color: black;
}

$size-wide: 70%;
$size-narrow: 30%;
.wide {
  .cd-panel__header {
    width: $size-wide;
  }
  .cd-panel__container {
    width: $size-wide;
  }
}
.narrow {
  .cd-panel__header {
    width: $size-narrow;

    @media only screen and (max-width: 1024px) {
      width: 100%;
    }
  }
  .cd-panel__container {
    width: $size-narrow;

    @media only screen and (max-width: 1024px) {
      width: 100%;
    }
  }
}
.cd-panel__footer {
  position: absolute;
  bottom: 0;
  height: 10%;
  width: 100%;
}

@media only screen and (max-width: 1024px) {
  .wide {
    .cd-panel__header {
      width: 82%;
    }
    .cd-panel__container {
      width: 82%;
    }
  }
}
@media only screen and (max-width: 700px) {
  .wide {
    .cd-panel__header {
      width: 100%;
    }
    .cd-panel__container {
      width: 100%;
    }
  }
}
</style>
