<template>
  <div class="foldable-block">
    <span
      v-if="draggable"
      class="handle"
    >
      <i class="ic-Drag-Column-Icon" />
    </span>
    <span class="title">{{ title }}</span>
    <a @click.prevent="toggleShow">
      <i
        v-if="isOpen"
        class="ic-Arrow-Up-Icon"
      />
      <i
        v-else
        class="ic-Arrow-Down-Icon"
      />
    </a>
    <div
      class="foldable-content"
      :class="{ contentHidden: !isOpen, contentVisible: isOpen}"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'FoldableBlock',
  props: {
    defaultOpen: Boolean,
    title: String,
    draggable: Boolean,
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
};
</script>

<style lang="scss">
.foldable-block {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1em;
  padding-bottom: 1em;
  clear: both;
  .title {
    font-size: 14px;
    font-weight: 600;
  }
  i {
    font-size: 24px;
    color: #b5b5b5;
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
    max-height: 500px;
  }
  .foldable-content {
    overflow: hidden;
    transition: max-height 0.25s ease-in;
    padding-top: 1.5em;
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
