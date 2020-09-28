<template>
  <p :class="statusColor">
    {{ status }}
    {{ dateStatus }}
  </p>
</template>

<script>

export default {
  props: {
    content: {
      type: Object,
    },
  },
  computed: {
    status() {
      const status = this.$loGet(this.content, 'accessPoint.billingStatus', '-');
      if (!status || status === '-') {
        return '-';
      }
      return this.$t('getparc.actLines.simStatuses.' + status);
    },
    dateStatus() {
      const billingStatus = this.$loGet(this.content, 'accessPoint.billingStatus');

      const billingStatusChangeDate = this.$loGet(this.content, 'accessPoint.billingStatusChangeDate', '');
      const commercialStatusDate = this.$loGet(this.content, 'accessPoint.commercialStatusDate', '');

      let dateToReturn;

      if (billingStatus !== 'CANCELED') {
        return billingStatusChangeDate;
      } else {
        return commercialStatusDate;
      }

    },
    statusColor() {
      let status = this.$loGet(this.content, 'accessPoint.billingStatus', '-');
      let color;
      switch (status) {
        case 'ACTIVATED':
          color = 'text-success';
          break;
        case 'SUSPENDED':
          color = 'text-warning';
          break;
        case 'CANCELED':
          color = 'text-danger';
          break;
        case 'TEST':
          color = 'text-danger';
          break;
        default:
          color = '';
      }
      return color;
    },
  },
};
</script>

<style lang="scss" scoped></style>
