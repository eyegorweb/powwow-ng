<template>
  <ul class="list-unstyled mb-0">
    <li>
      {{ get('getparc.lineDetail.alarms.data_io', alarm.level1, 'MB') }}
      {{ get('getparc.lineDetail.alarms.data_out', alarm.level1Up, 'MB') }}
      {{ get('getparc.lineDetail.alarms.data_in', alarm.level1Down, 'MB') }}
    </li>
    <li>
      {{ get('getparc.lineDetail.alarms.sms_io', alarm.level2) }}
      {{ get('getparc.lineDetail.alarms.sms_out', alarm.level2Up) }}
      {{ get('getparc.lineDetail.alarms.sms_in', alarm.level2Down) }}
    </li>
    <li>
      {{ get('getparc.lineDetail.alarms.voice_io', alarm.level3, 'MN') }}
      {{ get('getparc.lineDetail.alarms.voice_out', alarm.level3Up, 'MN') }}
      {{ get('getparc.lineDetail.alarms.voice_in', alarm.level3Down, 'MN') }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    alarm: Object,
  },
  methods: {
    get(labelKey, value, unit) {
      let translatedValue = undefined;
      if (!value) {
        return '';
      }
      if (unit) {
        translatedValue = this.$t(unit, { value });
      } else {
        translatedValue = value;
      }
      return `- ${this.$t(labelKey)}: ${translatedValue}`;
    },
  },
};
</script>

<style lang="scss" scoped>
li {
  font-size: 0.75rem;
  margin-top: -0.3rem;
  margin-bottom: -0.3rem;
}
</style>
