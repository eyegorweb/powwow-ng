<template>
  <div class="foldable-block pt-3">
    <div class="d-flex align-items-center">
      <span v-if="draggable" class="handle">
        <i class="ic-Drag-Column-Icon" />
      </span>
      <span class="title flex-grow-1">{{ title }}</span>
      <button class="btn p-0" @click.prevent="toggleShow">
        <i :class="iconClass" />
      </button>
    </div>
    <div class="pt-3">
      <TransitionCollapse>
        <slot v-if="isOpen" />
      </TransitionCollapse>
    </div>
  </div>
</template>

<script>
import TransitionCollapse from '@/components/TransitionCollapse';

export default {
  name: 'FoldableBlock',
  props: {
    defaultOpen: Boolean,
    title: String,
    draggable: Boolean,
  },

  computed: {
    iconClass() {
      return this.isOpen ? 'ic-Arrow-Up-Icon' : 'ic-Arrow-Down-Icon';
    },
  },

  data() {
    return {
      isOpen: this.defaultOpen,
    };
  },

  methods: {
    toggleShow() {
      this.isOpen = !this.isOpen;
    },
  },

  components: { TransitionCollapse },
};
</script>

<style lang="scss" scoped>
.foldable-block {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  clear: both;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  i {
    font-size: 24px;
    color: $gray-680;
    position: relative;
    top: 2px;
  }

  // fix pour Safari
  .btn {
    background-color: transparent;
  }

  .handle {
    margin-right: 5px;
    position: relative;
    top: 2px;
  }
  .handle:hover {
    cursor: move;
  }
}
</style>
