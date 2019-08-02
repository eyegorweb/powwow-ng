<template>
  <div class="bloc d-inline-block p-1 widgets-item" :class="{ wide: large, narrow: !large }">
    <div class="card">
      <div class="card-header">
        <span class="handle ic-Drag-Column-Icon" />
        <span>{{ title }}</span>
      </div>
      <div class="card-body pt-0">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    large: Boolean,
    title: String,
  },
};
</script>

<style lang="scss" scoped>
.card {
  .card-header {
    background: none;
    color: $dark-gray;
    border-bottom: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }
}
</style>
