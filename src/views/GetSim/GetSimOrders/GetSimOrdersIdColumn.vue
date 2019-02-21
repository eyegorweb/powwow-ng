<template>
  <a href="#" @click.prevent="onClick()">{{ row.id }}</a>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    onClick() {
      this.openPanel({
        title: this.$t('getsim.details.title', { id: this.row.id }),
        panelId: 'getsim.details.title',
        payload: this.row,
        wide: false,
      });
    },
  },
};
</script>

<style scoped>
</style>
