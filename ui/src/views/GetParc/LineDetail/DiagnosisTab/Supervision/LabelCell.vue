<template>
  <div>
    <div class="label" :class="{ opened: isOpened, closed: isClosed }">
      <span v-if="isOpened || isClosed" class="circle" />
      {{ getLabel }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: String,
  },
  computed: {
    getLabel() {
      if (this.item === 'F') {
        return 'Fermé';
      } else if (this.item === 'O') {
        return 'Ouvert';
      } else if (this.item === 'N') {
        return 'Normale';
      } else if (this.item === 'A') {
        return 'Autre';
      } else {
        return '';
      }
    },

    isClosed() {
      return this.item === 'F';
    },

    isOpened() {
      return this.item === 'O';
    },
  },
};
</script>

<style lang="scss">
@import '@/theme/scss/mixins/_circle.scss';

div {
  .label {
    padding: 0.25rem 0.4rem;
    &.closed {
      .circle {
        @include circle;
      }
    }
    &.opened {
      color: $success;
      .circle {
        @include circle;
        background-color: $success;
      }
    }
  }
}
</style>
