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
    alarm: Object,
  },
  data() {
    return {
      actions: ['getsim.actions.DETAIL'],
    };
  },

  methods: {
    onActionClicked(action) {
      if (action === 'getsim.actions.DETAIL') {
        console.log('Voir détail');
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
