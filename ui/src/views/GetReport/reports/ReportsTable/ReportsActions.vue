<template>
  <ActionButtons :actions="actions" @itemClick="onActionClicked" />
</template>

<script>
import ActionButtons from '@/components/DataTable/ActionButtons.vue';

export default {
  components: {
    ActionButtons,
  },
  props: {
    report: Object,
  },
  data() {
    return {
      actions: ['getsim.actions.DETAIL'],
    };
  },

  methods: {
    onActionClicked(action) {
      if (action === 'getsim.actions.DETAIL') {
        // this.$router.push({ name: 'alarmDetail', params: { alarmId: this.alarm.id } });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
