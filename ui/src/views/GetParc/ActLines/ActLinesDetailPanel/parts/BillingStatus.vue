<template>
  <p :class="statusColor">
    {{ status }}
    {{ dateStatus }}
  </p>
</template>

<script>
import get from 'lodash.get';

export default {
  props: {
    content: {
      type: Object,
    },
  },
  methods: {
    get(path, defaultVal = '-') {
      return get(this.content, path, defaultVal);
    },
  },
  computed: {
    status() {
      const status = this.get('accessPoint.billingStatus');
      if (!status || status === '-') {
        return '-';
      }
      return this.$t('getparc.actLines.simStatuses.' + status);
    },
    dateStatus() {
      const date = this.get('accessPoint.billingStatusChangeDate');
      if (!date || date === '-') {
        return '';
      }
      return date;
    },
    statusColor() {
      let status = this.get('accessPoint.billingStatus');
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
