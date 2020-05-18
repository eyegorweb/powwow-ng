<template>
  <div
    class="item"
    :class="{
      group: item.groupParent,
    }"
  >
    <button
      class="btn btn-outline-secondary"
      :class="{
        'btn-outline-secondary': !item.groupParent,
        'btn-secondary': item.groupParent,
      }"
      @click.stop="$emit('click', item)"
      :disabled="disabled"
    >
      <i :class="isRemoving ? 'ic-Minus-Icon ' : 'ic-Plus-Icon'"></i>
    </button>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    isRemoving: Boolean,
    disabled: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.btn {
  border-radius: 50%;
  padding: calc(0.25em - 2px) 0.375em;
  margin-right: 0.5rem;
  margin-bottom: 0.7rem;

  &.btn-secondary {
    color: white;
  }

  i::before {
    font-weight: bold;
  }
}

.item {
  span {
    position: relative;
    bottom: 0.2rem;
  }
  &.group {
    span {
      color: $secondary;
      font-weight: bold;
    }
  }
}
</style>
