<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-phone-incoming"></i>
      {{ $t('input') }}:
      {{ formatBytes(row.pdpConnectionHistory.downloadVolume) }}
    </li>
    <li>
      <i class="ic-phone-outgoing"></i>
      {{ $t('output') }}:
      {{ formatBytes(row.pdpConnectionHistory.uploadVolume) }}
    </li>
  </ul>
</template>

<script>
import { formatBytes } from '@/api/utils';

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
