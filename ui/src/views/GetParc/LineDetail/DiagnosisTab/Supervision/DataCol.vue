<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-phone-incoming"></i>
      {{ $t('input') }}:
      {{ row.pdpConnectionHistory.downloadVolume }}
      Mo
    </li>
    <li>
      <i class="ic-phone-outgoing"></i>
      {{ $t('output') }}:
      {{ row.pdpConnectionHistory.uploadVolume }}
      Mo
    </li>
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
