<template>
  <div class="bloc d-inline-block p-1 widgets-item">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-9">
            <div class="d-flex">
              <span class="handle ic-Drag-Column-Icon" />
              <span :class="{ 'mock-value': mocked, 'col-6': small }">
                <WidgetTitle :title="widget.title" />
              </span>
              <slot name="header" />
            </div>
          </div>
          <div class="col-3" v-if="widget.seeMore">
            <button class="btn btn-link float-right p-0 m-0" @click="$emit('seeMore')">
              {{ $t('seeMore') }}
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
import WidgetTitle from './WidgetTitle';

export default {
  components: {
    WidgetTitle,
  },
  props: {
    widget: Object,
    noPadding: Boolean,
    scrolling: Boolean,
    mocked: Boolean,
    small: Boolean,
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
    height: 16rem;
  }
}

.bloc {
  width: 100%;
}
</style>
