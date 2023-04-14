<template>
  <ul class="list-unstyled text-danger error">
    <li v-for="e in errors" :key="e.key">
      {{ $t('errors.' + e.key + '.' + e.value) }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    errors: Array,
  },
};
</script>

<style lang="scss" scoped>
.error {
  margin: 1rem;
}
</style>
