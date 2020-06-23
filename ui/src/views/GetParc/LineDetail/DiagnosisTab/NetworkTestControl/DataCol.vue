<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-phone-incoming"></i>
      {{ $t('input') }}:
      {{ formatBytes(row.dataIn) }}
    </li>
    <li>
      <i class="ic-phone-outgoing"></i>
      {{ $t('output') }}:
      {{ formatBytes(row.dataOut) }}
    </li>
  </ul>
</template>

<script>
import { formatBytes } from '@/api/utils.js';

export default {
  props: {
    row: Object,
  },
  methods: {
    formatBytes(value) {
      return formatBytes(value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
