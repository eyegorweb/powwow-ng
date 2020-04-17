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
    row: Object,
  },
  data() {
    return {
      actions: ['actions.DOWNLOAD', 'actions.DELETE'],
    };
  },

  methods: {
    onActionClicked(action) {
      if (action === 'actions.DELETE') {
        this.$emit('deleteDocument');
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
