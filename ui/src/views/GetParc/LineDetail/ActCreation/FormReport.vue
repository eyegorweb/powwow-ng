<template>
  <ul class="list-unstyled text-danger error">
    <li v-for="e in data.errors" :key="e.key">{{ $t('getparc.actCreation.report.' + e.key) }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    data: Object,
  },
};
</script>

<style lang="scss" scoped>
.error {
  margin: 1rem;
  font-weight: 500 !important;
}
</style>
