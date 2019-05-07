<template>
  <div class="foldable-block pt-3">
    <div class="d-flex align-items-center">
      <span v-if="draggable" class="handle">
        <i class="ic-Drag-Column-Icon" />
      </span>
      <span class="title flex-grow-1">{{ title }}</span>
      <a class=" p-0" @click.prevent="toggleShow">
        <i :class="iconClass" />
      </a>
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
    font-size: 1rem;
    font-weight: 600;
  }
  i {
    font-size: 24px;
    color: $gray-680;
    position: relative;
    top: 2px;
  }
  a {
    float: right;
  }
  a:hover {
    cursor: pointer;
  }
  .contentHidden {
    max-height: 0;
    padding-top: 0 !important;
  }
  .contentVisible {
    max-height: 100%;

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
}
</style>
