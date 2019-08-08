<template>
  <div
    class="bloc d-inline-block p-1 widgets-item"
    :class="{ wide: widget.large, narrow: !widget.large }"
  >
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col">
            <span class="handle ic-Drag-Column-Icon" />
            <span>{{ widget.title }}</span>
          </div>
          <div class="col">
            <button class="btn btn-link float-right p-0 m-0" @click="$emit('seeMore')">
              Voir plus
            </button>
          </div>
        </div>
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
    widget: Object,
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

.bloc {
  &.narrow {
    width: 33.3333%;
  }

  &.wide {
    width: 66.6666%;
  }
}
</style>
