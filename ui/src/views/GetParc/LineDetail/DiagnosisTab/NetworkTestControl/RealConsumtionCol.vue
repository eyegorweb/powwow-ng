<template>
  <ul class="list-unstyled">
    <li>{{ $t('from') }} {{ firstDate }}</li>
    <li>{{ $t('to') }} {{ lastDate }}</li>
  </ul>
</template>

<script>
export default {
  props: {
    row: Object,
  },
  computed: {
    firstDate() {
      const incomingDate = this.$loGet(this.row, 'fistIncomingTicketDate');
      const outgoingDate = this.$loGet(this.row, 'fistOutgoingTicketDate');
      if (incomingDate || outgoingDate) {
        return incomingDate < outgoingDate ? incomingDate : outgoingDate;
      } else {
        return '-';
      }
    },
    lastDate() {
      const incomingDate = this.$loGet(this.row, 'lastIncomingTicketDate');
      const outgoingDate = this.$loGet(this.row, 'lastOutgoingTicketDate');
      if (incomingDate || outgoingDate) {
        return incomingDate > outgoingDate ? incomingDate : outgoingDate;
      } else {
        return '-';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
