<template>
  <div class="card block-checkbox-option no-select mb-2 d-flex opt-container">
    <div class="d-flex opt-container">
      <div class="b-check d-flex justify-content-center pl-3 pt-2">
        <UiCheckbox shape="round" v-model="model" />
      </div>
      <div class="opt-content flex-grow-1">
        <div class="skeleton-line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiCheckbox,
  },
  data() {
    return {
      model: undefined,
    };
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
}
.block-checkbox-option {
  border: 1px solid $medium-gray;
  &:hover,
  &.active {
    border: 1px solid $bouygues-cyan;
    cursor: pointer;
  }
}
</style>
