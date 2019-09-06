<template>
  <div
    class="bloc d-inline-block p-1 widgets-item"
    :class="{ wide: widget.large, narrow: !widget.large }"
  >
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-9">
            <span class="handle ic-Drag-Column-Icon" />
            <span :class="{ 'mock-value': mocked }">{{ widget.title }}</span>
          </div>
          <div class="col-3">
            <button class="btn btn-link float-right p-0 m-0" @click="$emit('seeMore')">
              Voir plus
            </button>
          </div>
        </div>
      </div>
      <div class="card-body" :class="className">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    widget: Object,
    noPadding: Boolean,
    mocked: Boolean,
  },
  computed: {
    className() {
      return this.noPadding ? 'p-0' : 'pt-0';
    },
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

  .card-body {
    height: 14rem;
    overflow: hidden;
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
