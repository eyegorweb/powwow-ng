<template>
  <ul class="list-unstyled">
    <li :key="boundAlarm.id" v-for="boundAlarm in boundAlarms">
      {{ boundAlarm.alarm ? boundAlarm.alarm.name : '' }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    row: Object,
  },

  computed: {
    boundAlarms() {
      if (!this.row.boundAlarms) return [];

      return this.row.boundAlarms;
    },
  },
};
</script>

<style lang="scss" scoped></style>
