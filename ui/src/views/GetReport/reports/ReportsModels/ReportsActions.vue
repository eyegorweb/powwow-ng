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
      actions: [
        'getreport.actions.DETAIL',
        'getreport.actions.ACTIVATION',
        'getreport.actions.SEARCH',
      ],
    };
  },

  methods: {
    onActionClicked(action) {
      if (action === 'getreport.actions.DETAIL') {
        // this.$router.push({ name: 'alarmDetail', params: { alarmId: this.alarm.id } });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
