<template>
  <div>
    <span v-if="row.isTriggered">{{ $t('common.YES') }}</span>
    <span v-else>{{ $t('common.NO') }}</span>
  </div>
</template>

<script>
export default {
  name: 'IdCell',
  props: {
    row: Object,
  },
};
</script>
