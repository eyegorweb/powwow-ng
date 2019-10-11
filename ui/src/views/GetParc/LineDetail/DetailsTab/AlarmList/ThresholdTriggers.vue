<template>
  <div>
    <ul class="list-unstyled mb-0">
      <li>
        {{ get('getparc.lineDetail.alarms.data_io', row.alarm.level1, 'MB') }}
        {{ get('getparc.lineDetail.alarms.data_out', row.alarm.level1Up, 'MB') }}
        {{ get('getparc.lineDetail.alarms.data_in', row.alarm.level1Down, 'MB') }}
      </li>
      <li>
        {{ get('getparc.lineDetail.alarms.sms_io', row.alarm.level2) }}
        {{ get('getparc.lineDetail.alarms.sms_out', row.alarm.level2Up) }}
        {{ get('getparc.lineDetail.alarms.sms_in', row.alarm.level2Down) }}
      </li>
      <li>
        {{ get('getparc.lineDetail.alarms.voice_io', row.alarm.level3, 'MN') }}
        {{ get('getparc.lineDetail.alarms.voice_out', row.alarm.level3Up, 'MN') }}
        {{ get('getparc.lineDetail.alarms.voice_in', row.alarm.level3Down, 'MN') }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
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
}
</style>
