<template>
  <div class="mb-4">
    <div class="d-flex align-items-center">
      <h4 class="text-primary text-uppercase">
        <i v-if="!noHandle" class="handle ic-Drag-Column-Icon"></i>
        <slot name="title" />
      </h4>
      <div class="flex-grow-1">
        <slot name="topRight" />
      </div>
    </div>
    <slot name="afterTitle" />
    <div>
      <div class="bg-white p-4 rounded">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noHandle: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.item {
  margin-right: 0.5rem;
  flex-grow: 1;
  h6 {
    color: #7d7d7d;
    font-size: 0.8rem;
    font-weight: 400;
  }
}
</style>
