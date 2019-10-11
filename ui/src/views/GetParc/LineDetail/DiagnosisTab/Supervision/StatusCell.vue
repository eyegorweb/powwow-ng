<template>
  <div>
    <div class="label" :class="{ opened: isOpened, closed: isClosed }">
      <span v-if="isOpened || isClosed" class="circle" />
      {{ label }}
    </div>
  </div>
</template>

<script>
// TODO: Voir si on ne peut pas réfactorer tout les status cell ensemble

export default {
  props: {
    format: {
      type: Object,
      required: true,
    },
    row: Object,
  },
  computed: {
    status() {
      if (this.row && this.row.pdpConnectionHistory.connectionStatus) {
        return this.row.pdpConnectionHistory.connectionStatus;
      } else {
        return '';
      }
    },
    label() {
      if (this.status === 'F') {
        return 'Fermé';
      } else if (this.status === 'O') {
        return 'Ouvert';
      } else {
        return '';
      }
    },

    isClosed() {
      return this.status === 'F';
    },

    isOpened() {
      return this.status === 'O';
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
