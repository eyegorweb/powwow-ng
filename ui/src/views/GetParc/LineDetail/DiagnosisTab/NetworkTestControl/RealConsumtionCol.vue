<template>
  <ul class="list-unstyled">
    <li>{{ $t('from') }} {{ row.fistIncomingTicketDate }}</li>
    <li>{{ $t('to') }} {{ row.fistOutgoingTicketDate }}</li>
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
