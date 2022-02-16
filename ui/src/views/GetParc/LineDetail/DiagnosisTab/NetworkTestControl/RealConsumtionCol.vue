<template>
  <ul class="list-unstyled">
    <li>{{ $t('from') }} {{ firstDate }}</li>
    <li>{{ $t('to') }} {{ lastdate }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  computed: {
    firstDate() {
      return this.row.fistIncomingTicketDate < this.row.fistOutgoingTicketDate
        ? this.row.fistIncomingTicketDate
        : this.row.fistOutgoingTicketDate;
    },
    lastDate() {
      return this.row.lastIncomingTicketDate > this.row.lastOutgoingTicketDate
        ? this.row.lastIncomingTicketDate
        : this.row.lastOutgoingTicketDate;
    },
  },
};
</script>

<style lang="scss" scoped></style>
