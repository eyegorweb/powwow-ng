<template>
  <ul class="list-unstyled">
    <li>
      <i class="ic-phone-incoming"></i>
      {{ $t('input') }}:
      {{ row.voiceIn }}
    </li>
    <li>
      <i class="ic-phone-outgoing"></i>
      {{ $t('output') }}:
      {{ row.voiceOut }}
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
