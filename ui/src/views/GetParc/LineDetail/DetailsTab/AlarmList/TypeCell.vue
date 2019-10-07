<template>
  <div>
    <div class="title-name">{{ name }}</div>
    <div class="title-type">{{ type }}</div>
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  name: 'TypeCell',
  props: {
    row: Object,
  },
  methods: {
    getFromContent(path, defaultValue = '') {
      const value = get(this.row, path, defaultValue);
      return value !== null ? value : '';
    },
  },
  computed: {
    name() {
      const name = this.getFromContent('alarm.name');
      if (!name) return this.type;
      return name;
    },
    type() {
      const value = this.getFromContent('alarm.type');
      const translatedValue = `${'getparc.lineDetail.alarms.ALARM_TYPE.'}${value}`;
      return this.$t(translatedValue);
    },
  },
};
</script>

<style lang="scss" scoped>
.title-name {
  font-size: 0.875rem;
  color: $dark-gray;
}
.title-type {
  font-size: 0.75rem;
  color: $gray-680;
}
</style>
