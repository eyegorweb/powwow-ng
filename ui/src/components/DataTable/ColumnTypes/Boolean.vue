<template>
  <div>
    <span v-if="item">{{ $t('common.YES') }}</span>
    <span v-if="!item">{{ $t('common.NO') }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Boolean,
    },
  },
};
</script>

<style scoped></style>
