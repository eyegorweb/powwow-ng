<template>
  <div
    class="card home-panel-option no-select mb-2 d-flex opt-container"
    @click="model = !model"
    :class="{ active: model }"
  >
    <div class="d-flex opt-container">
      <div class="b-check d-flex justify-content-center pl-3 pt-2">
        <UiCheckbox shape="round" v-model="model" />
      </div>
      <div class="opt-content flex-grow-1">
        <h6>
          <WidgetTitle :title="title" />
        </h6>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import WidgetTitle from './widgets/WidgetTitle';

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
    WidgetTitle,
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
      font-weight: 444;
      padding-top: 1.2rem;
    }
  }
}

@media only screen and (min-width: 1025px) and (max-width: 1366px) {
  .opt-container {
    .opt-content {
      h6 {
        font-size: 1.3rem;
      }
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
