<template>
  <ul class="list-unstyled text-danger font-weight-bold">
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

<style lang="scss" scoped></style>
