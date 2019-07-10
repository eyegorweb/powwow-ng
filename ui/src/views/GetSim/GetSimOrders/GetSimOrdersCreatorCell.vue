<template>
  <a href="#" @click.prevent="onClick()">
    {{ row.auditable.creator.name.firstName }} {{ row.auditable.creator.name.lastName }}
  </a>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'GetSimOrdersCreatorCell',
  props: {
    row: {
      type: Object,
    },
  },
  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      this.openPanel({
        title: this.$t('getsim.creator.title', this.row.auditable.creator.name),
        panelId: 'getsim.creator.title',
        payload: this.row,
        wide: false,
      });
    },
  },
};
</script>

<style scoped></style>
