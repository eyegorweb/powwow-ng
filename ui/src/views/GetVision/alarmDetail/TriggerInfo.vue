<template>
  <ul class="list-unstyled">
    <li class="data-info">{{ reason }}</li>
    <li class="date-info">{{ triggerDate }}</li>
  </ul>
</template>

<script>
import { formatBytes, formattedValueFromSeconds } from '@/api/utils';

export default {
  props: {
    info: Object,
  },
  computed: {
    triggerDate() {
      return this.info.triggerDate;
    },
    reason() {
      if (this.info && this.info.reasonAndValue && this.info.reasonAndValue.length) {
        const reasonVal = this.info.reasonAndValue[0];

        const reasonTxt = this.$t('getparc.lineDetail.alarms.' + reasonVal.reason.toLowerCase());
        let reasonValue = reasonVal.value;

        if (['DATA_IN', 'DATA_OUT', 'DATA'].includes(reasonVal.reason)) {
          reasonValue = formatBytes(reasonVal.value);
        }

        if (['VOICE', 'VOICE_OUT', 'VOICE_IN'].includes(reasonVal.reason)) {
          reasonValue = formattedValueFromSeconds(reasonVal.value);
        }

        return `${reasonTxt}: ${reasonValue}`;
      }

      return '-';
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  .data-info {
    color: $orange;
    text-decoration: underline;
  }

  .date-info {
    font-size: 0.8rem;
    color: $gray-680;
  }
}
</style>
