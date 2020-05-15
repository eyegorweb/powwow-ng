<template>
  <div class="statusCell">
    <div class="statusCell-circle" :class="status"></div>
    <div class="statusCell-name" :class="status">{{ $t('col.' + status) }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    row: {
      type: Object,
    },
  },

  methods: {
    isActive() {
      switch (this.row.status) {
        case 'ACTIVE':
          this.status = 'active';
          break;
        case 'LOCKED':
          this.status = 'locked';
          break;
        case 'CLOSED':
          this.status = 'closed';
          break;
        default:
          this.status = '';
          break;
      }
    },
  },

  mounted() {
    this.isActive();
  },
  data() {
    return {
      status: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
.statusCell {
  display: flex;
  align-items: center;

  &-circle {
    width: 10px;
    height: 10px;
    border-radius: 10px;
    margin-right: 10px;

    &.active {
      background-color: $success;
    }
    &.locked {
      background-color: $warning;
    }
    &.closed {
      background-color: $orange;
    }
  }

  &-name {
    &.active {
      color: $success;
    }
    &.locked {
      color: $warning;
    }
    &.closed {
      color: $orange;
    }
  }
}
</style>
