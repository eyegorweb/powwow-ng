<template>
  <div>
    <div class="label" :class="{ opened: isOpened, closed: isClosed }">
      <span v-if="isOpened || isClosed" class="circle" />
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    format: {
      type: Object,
      required: true,
    },
    row: Object,
  },
  computed: {
    value() {
      return this.format.getValue(this.row);
    },
    label() {
      if (this.value === 'F') {
        return 'Fermé';
      } else if (this.value === 'O') {
        return 'Ouvert';
      } else if (this.value === 'N') {
        return 'Normale';
      } else if (this.value === 'A') {
        return 'Autre';
      } else {
        return '';
      }
    },

    isClosed() {
      return this.value === 'F';
    },

    isOpened() {
      return this.value === 'O';
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
