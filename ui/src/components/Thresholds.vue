<template>
  <Fragment>
    <span class="item-container" :key="value" v-for="(value, index) in thresholds">
      <span>
        {{ value }}
      </span>
      <span v-if="index != thresholds.length - 1">, </span>
    </span>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

import { formatBytes, formattedValueFromSeconds } from '@/api/utils';

export default {
  components: {
    Fragment,
  },
  props: {
    alarm: Object,
  },
  computed: {
    thresholds() {
      if (!this.alarm) return [];

      const values = [];
      const labelKey = 'getparc.lineDetail.alarms.';

      if (this.alarm.level1) {
        values.push(`${this.$t(labelKey + 'data')}: ${formatBytes(parseInt(this.alarm.level1))}`);
      }
      if (this.alarm.level1Up) {
        values.push(
          `${this.$t(labelKey + 'data_out')}: ${formatBytes(parseInt(this.alarm.level1Up))}`
        );
      }
      if (this.alarm.level1Down) {
        values.push(
          `${this.$t(labelKey + 'data_in')}: ${formatBytes(parseInt(this.alarm.level1Down))}`
        );
      }

      if (this.alarm.level2) {
        values.push(`${this.$t(labelKey + 'sms')}: ${this.alarm.level2}`);
      }
      if (this.alarm.level2Up) {
        values.push(`${this.$t(labelKey + 'sms_out')}: ${this.alarm.level2Up}`);
      }
      if (this.alarm.level2Down) {
        values.push(`${this.$t(labelKey + 'sms_in')}: ${this.alarm.level2Down}`);
      }

      if (this.alarm.level3) {
        values.push(
          `${this.$t(labelKey + 'voice')}: ${formattedValueFromSeconds(
            parseInt(this.alarm.level3)
          )}`
        );
      }
      if (this.alarm.level3Up) {
        values.push(
          `${this.$t(labelKey + 'voice_out')}: ${formattedValueFromSeconds(
            parseInt(this.alarm.level3Up)
          )}`
        );
      }
      if (this.alarm.level3Down) {
        values.push(
          `${this.$t(labelKey + 'voice_in')}: ${formattedValueFromSeconds(
            parseInt(this.alarm.level3Down)
          )}`
        );
      }

      return values;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-container {
  font-size: 0.75rem;
}
</style>
