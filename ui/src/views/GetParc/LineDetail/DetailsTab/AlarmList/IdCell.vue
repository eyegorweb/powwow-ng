<template>
  <button class="btn btn-link p-0" @click.prevent="openPanel">{{ row.alarm.id }}</button>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'IdCell',
  props: {
    row: Object,
  },

  methods: {
    ...mapMutations(['openPanel']),

    openPanel() {
      console.log('openPanel');
    },
  },
  computed: mapState({
    isOpen: state => state.ui.isPanelOpen,
  }),
};
</script>
