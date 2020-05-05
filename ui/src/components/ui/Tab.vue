<template>
  <li
    class="tab-label d-flex flex-column align-items-center px-4 px-lg-2 px-xl-4 pb-3 "
    :class="{ 'is-selected': isSelected, disableTab: disableMenu }"
    @click="$emit('selected')"
  >
    <slot />
  </li>
</template>

<script>
export default {
  name: 'UiTab',
  props: {
    isSelected: Boolean,
    disableMenu: Boolean,
  },
};
</script>
<style scoped lang="scss">
.tab-label {
  display: block;
  flex-basis: 91px;

  cursor: pointer;

  &.is-selected {
    border-bottom: $secondary solid 3px;
    color: $secondary;
    font-weight: 600;
  }

  a {
    color: inherit;
  }
}
</style>
