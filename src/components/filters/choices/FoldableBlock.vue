<template>
  <div class="foldable-block">
    <span
      v-if="draggable"
      class="handle"
    ><i class="ic-Drag-Column-Icon" /></span>
    <span class="title">{{ title }}</span>
    <a @click="toggleShow">
      <i
        v-if="!isOpen"
        class="ic-Arrow-Down-Icon"
      />
      <i
        v-if="isOpen"
        class="ic-Arrow-Up-Icon"
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
    cursor: pointer;
  }
}
</style>
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
    toggleShow(e) {
      e.preventDefault();
      this.isOpen = !this.isOpen;
    },
  },
};
</script>
