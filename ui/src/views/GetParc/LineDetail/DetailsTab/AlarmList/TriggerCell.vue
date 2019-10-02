<template>
  <div>
    <button v-if="row.isTriggered" class="btn btn-link p-0">{{ $t('common.YES') }}</button>
    <button v-else class="btn btn-link p-0">{{ $t('common.NO') }}</button>
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
