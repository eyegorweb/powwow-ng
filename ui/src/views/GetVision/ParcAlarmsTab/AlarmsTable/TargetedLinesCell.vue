<template>
  <button class="btn btn-link p-0">{{ row.numberOfTargetedLines }}</button>
</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>

<style lang="scss" scoped></style>
