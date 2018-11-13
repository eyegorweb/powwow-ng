<template>
  <div class="nav">
    <div
      v-for="icon in navIcons"
      class="icon"
      :class="icon.class"
      :key="icon.key"
    >
      <i
        class="arrow ic-Arrow-Down-Icon"
        v-if="icon.isMultilevels"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavIcons',
  props: {
    navIcons: {
      type: Array,
    },
  },
};
</script>

<style scoped lang="scss">
.nav {
  justify-content: space-around;
}

.icon {
  position: relative;
  color: $dark-grey;
  font-size: 24px;

  &:last-child {
    margin-left: 30px;
  }

  .arrow {
    display: inline-block;
  }

  &.ic-Clock-Icon:after {
    content: '8';
    display: block;
    width: 16px;
    height: 16px;
    font-size: 12px;
    color: $white;
    background-color: $orange;
    position: absolute;
    top: -7px;
    right: -5px;
    font-family: 'Open Sans', sans-serif;
    border-radius: 50%;
    padding: 2px 5px;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
