<template>
  <button
    v-if="!userIsByCustomerAccount"
    class="btn btn-link btn-select p-0"
    @click.stop="openPanel"
  >
    {{ row.alarm.id }}
  </button>
  <span v-else>{{ row.alarm.id }}</span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'IdCell',
  props: {
    row: Object,
  },
  computed: {
    ...mapGetters(['userIsByCustomerAccount']),
  },
  methods: {
    openPanel() {
      this.$emit('colEvent', { action: 'openAlarmModificationPanel', row: this.row });
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-select {
  user-select: initial;
}
</style>
