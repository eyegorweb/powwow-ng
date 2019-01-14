<template>
  <div
    class="card home-panel-option no-select mb-2 d-flex opt-container"
    @click="model = !model"
    :class="{active: model}"
  >
    <div class="d-flex opt-container">
      <div class="b-check d-flex justify-content-center pl-3 pt-2">
        <UiCheckbox shape="round" v-model="model" />
      </div>
      <div class="opt-content flex-grow-1">
        <h6>{{ title }}</h6>
        <slot />
      </div>
      <div class="opt-image">
        <img class="not-found" src="@/assets/404.png" alt="image not found">
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'HomePanelOption',
  model: {
    prop: 'checked',
    event: 'update:checked',
  },
  props: {
    checked: Boolean,
    title: String,
  },
  components: {
    UiCheckbox,
  },
  computed: {
    model: {
      get: ({ checked }) => checked,
      set(model) {
        this.$emit('update:checked', model);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.opt-container {
  .opt-content {
    h6 {
      color: $bouygues-cyan;
      font-weight: 444;
    }
  }
  .opt-image {
    background: #dddddd;
    text-align: center;
    flex-basis: 100px;
    min-height: 6rem;
    .not-found {
      padding-top: 2rem;
    }
  }
}

.home-panel-option {
  border: 1px solid $medium-gray;
  &:hover,
  &.active {
    border: 1px solid $bouygues-cyan;
    cursor: pointer;
  }
}
</style>
