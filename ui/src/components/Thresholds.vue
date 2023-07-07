<template>
  <Fragment>
    <span
      class="item-container"
      :key="`key_t_${data}_${index}`"
      v-for="(data, index) in thresholds"
    >
      <template v-if="data && data.value">
        <span :class="data.className">
          {{ data.value }}
        </span>
        <span v-if="index !== thresholds.length - 1">, </span>
      </template>
      <template v-else>
        <span> {{ data }} </span>
        <span v-if="index !== thresholds.length - 1">, </span>
      </template>
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

      let values = [];
      const labelKey = 'getparc.lineDetail.alarms.';

      if (this.alarm.type === 'OVER_CONSUMPTION_VOLUME_FLOTTE') {
        if (this.alarm.levelDataMax) {
          values.push({
            value:
              'Data: ' +
              this.alarm.levelDataMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.dateDataMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.levelData1) {
            values.push({
              value:
                this.alarm.levelData1 +
                '% ' +
                (this.alarm.dateLevelData1 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelData1 })),
              className: this.alarm.dateData1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.levelData2) {
            values.push({
              value:
                this.alarm.levelData2 +
                '% ' +
                (this.alarm.dateLevelData2 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelData2 })),
              className: this.alarm.dateData2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
        if (this.alarm.levelVoiceMax) {
          values.push({
            value:
              this.$t('voice') +
              ': ' +
              this.alarm.levelVoiceMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.dateVoiceMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.levelVoice1) {
            values.push({
              value:
                this.alarm.levelVoice1 +
                '% ' +
                (this.alarm.dateLevelVoice1 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelVoice1 })),
              className: this.alarm.dateVoice1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.levelVoice2) {
            values.push({
              value:
                this.alarm.levelVoice2 +
                '% ' +
                (this.alarm.dateLevelVoice2 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelVoice2 })),
              className: this.alarm.dateVoice2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
        if (this.alarm.levelSmsMax) {
          values.push({
            value:
              'Sms: ' +
              this.alarm.levelSmsMax +
              '% ' +
              this.$t('getvsion.alarm-creation.beforeEndOfMonth'),
            className: this.alarm.dateSmsMaxTriggered ? 'text-danger' : 'threshold-default',
          });
          if (this.alarm.levelSms1) {
            values.push({
              value:
                this.alarm.levelSms1 +
                '% ' +
                (this.alarm.dateLevelSms1 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelSms1 })),
              className: this.alarm.dateSms1Triggered ? 'text-danger' : 'threshold-default',
            });
          }
          if (this.alarm.levelSms2) {
            values.push({
              value:
                this.alarm.levelSms2 +
                '% ' +
                (this.alarm.dateLevelSms2 === null
                  ? this.$t('getvsion.alarm-creation.beforeEndOfMonth')
                  : this.$t('date-over', { date: this.alarm.dateLevelSms2 })),
              className: this.alarm.dateSms2Triggered ? 'text-danger' : 'threshold-default',
            });
          }
        }
      } else if (this.alarm.type === 'NOSESSION') {
        if (this.alarm.dataNoSession) {
          values.push(
            `${this.$t(labelKey + 'data_disconnect')}: ${formattedValueFromSeconds(
              parseInt(this.alarm.dataNoSession)
            )}`
          );
        }
        if (this.alarm.dataInactiveSession) {
          values.push(
            `${this.$t(labelKey + 'data_without_session')}: ${formattedValueFromSeconds(
              parseInt(this.alarm.dataInactiveSession)
            )}`
          );
        }
      } else if (this.alarm.type === 'ATYPICAL_ACTIVITY') {
        if (this.alarm.voiceCallsThreshold) {
          values.push(`${this.$t(labelKey + 'callInOut')}: ${this.alarm.voiceCallsThreshold}`);
        }
        if (this.alarm.voiceCallsInThreshold) {
          values.push(`${this.$t(labelKey + 'call_in')}: ${this.alarm.voiceCallsInThreshold}`);
        }
        if (this.alarm.voiceCallsOutThreshold) {
          values.push(`${this.$t(labelKey + 'call_out')}: ${this.alarm.voiceCallsOutThreshold}`);
        }
        if (this.alarm.pdpSessionsThreshold) {
          values.push(`${this.$t(labelKey + 'data_session')}: ${this.alarm.pdpSessionsThreshold}`);
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
