<template>
  <div>
    <em v-for="n in checked" :key="'checked_star_' + n" class="icon ic-star-full" />
    <em v-for="n in rest" :key="'empty_star_' + n" class="icon ic-star-empty" />
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    rest() {
      return this.max - this.checked;
    },
  },
};
</script>

<style lang="scss" scoped>
.ic-star-full {
  color: $warning;
}
</style>
