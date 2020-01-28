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
      if (this.row && this.row.connectionStatusTranslated) {
        return this.row.connectionStatusTranslated;
      } else {
        return '';
      }
    },
    label() {
      if (this.status === 'FERMEE') {
        return 'Fermée';
      } else if (this.status === 'OUVERTE') {
        return 'Ouverte';
      } else {
        return '';
      }
    },

    isClosed() {
      return this.status === 'FERMEE';
    },

    isOpened() {
      return this.status === 'OUVERTE';
    },
  },
};
</script>

<style lang="scss">
@import '@/theme/scss/mixins/_circle.scss';

div {
  .label {
    padding: 0 0.2rem;
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
