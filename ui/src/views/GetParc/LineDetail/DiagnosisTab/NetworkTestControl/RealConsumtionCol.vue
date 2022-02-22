<template>
  <ul class="list-unstyled">
    <li>{{ $t('from') }} {{ firstDate || '-' }}</li>
    <li>{{ $t('to') }} {{ lastDate || '-' }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  computed: {
    firstDate() {
      if(this.row.fistIncomingTicketDate || this.row.fistOutgoingTicketDate) {
        return this.row.fistIncomingTicketDate < this.row.fistOutgoingTicketDate
          ? this.row.fistIncomingTicketDate
          : this.row.fistOutgoingTicketDate;
      }
    },
    lastDate() {
      if(this.row.lastIncomingTicketDate || this.row.lastOutgoingTicketDate) {
        return this.row.lastIncomingTicketDate > this.row.lastOutgoingTicketDate
          ? this.row.lastIncomingTicketDate
          : this.row.lastOutgoingTicketDate;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
