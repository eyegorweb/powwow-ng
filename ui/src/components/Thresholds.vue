<template>
  <Fragment>
    <span
      class="item-container"
      :key="`key_t_${data}_${index}`"
      v-for="(data, index) in thresholds"
    >
      <span :class="data.className">
        {{ data.value }}
      </span>
      <span v-if="index !== thresholds.length - 1">, </span>
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

      // Uniquement pour alarme mutualisé :
      if (this.alarm.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        if (this.alarm.meta.levelDataMax) {
          values.push({
            value:
              'Data: ' +
              this.alarm.meta.levelDataMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.meta.dateDataMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.meta.levelData1) {
            values.push({
              value:
                this.alarm.meta.levelData1 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelData1 }),
              className: this.alarm.meta.dateData1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.meta.levelData2) {
            values.push({
              value:
                this.alarm.meta.levelData2 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelData2 }),
              className: this.alarm.meta.dateData2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
        if (this.alarm.meta.levelVoiceMax) {
          values.push({
            value:
              this.$t('voice') +
              ': ' +
              this.alarm.meta.levelVoiceMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.meta.dateVoiceMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.meta.levelVoice1) {
            values.push({
              value:
                this.alarm.meta.levelVoice1 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelVoice1 }),
              className: this.alarm.meta.dateVoice1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.meta.levelVoice2) {
            values.push({
              value:
                this.alarm.meta.levelVoice2 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelVoice2 }),
              className: this.alarm.meta.dateVoice2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
        if (this.alarm.meta.levelSmsMax) {
          values.push({
            value:
              'Sms: ' +
              this.alarm.meta.levelSmsMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.meta.dateSmsMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.meta.levelSms1) {
            values.push({
              value:
                this.alarm.meta.levelSms1 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelSms1 }),
              className: this.alarm.meta.dateSms1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.meta.levelSms2) {
            values.push({
              value:
                this.alarm.meta.levelSms2 +
                '% ' +
                this.$t('date-over', { date: this.alarm.meta.dateLevelSms2 }),
              className: this.alarm.meta.dateSms2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
      } else {
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
      }

      return values;
    },
  },
};
</script>

<style lang="scss" scoped>
.item-container {
  font-size: 0.75rem;
  span.threshold-default {
    color: $success;
  }
}
</style>
