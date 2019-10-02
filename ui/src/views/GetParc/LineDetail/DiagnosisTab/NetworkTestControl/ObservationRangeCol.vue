<template>
  <ul class="list-unstyled">
    <li>{{ $t('from') }} {{ row.periodStartDate }}</li>
    <li>{{ $t('to') }} {{ row.periodEndDate }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped></style>
