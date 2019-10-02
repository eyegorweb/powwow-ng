<template>
  <div>
    <span v-if="row.isActive" class="text-success">{{ $t('filters.active') }}</span>
    <span v-else>{{ $t('orders.detail.deActivate') }}</span>
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
