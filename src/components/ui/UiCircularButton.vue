<template>
  <button class="round-button" @click="$emit('click')">
    <slot name="icon" />
  </button>
</template>

<script>
// TODO: voir si on ne peux pas merger ce composant avec UiButton
export default {
  name: 'UiCircularButton',
};
</script>

<style scoped lang="scss">
.round-button {
  display: block;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  color: $white;
  text-align: center;
  background: $primary;
  cursor: pointer;
  &.span {
    cursor: pointer;
  }
  &:disabled {
    background: $medium-gray;
    cursor: default;
    &.span {
      cursor: default;
    }
  }
}
</style>
