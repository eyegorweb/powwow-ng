<template>
  <button class="btn btn-link p-0" v-if="row.isTriggered" @click.stop="openPanel">
    {{ $t('common.YES') }}
  </button>
  <span v-else>{{ $t('common.NO') }}</span>
</template>

<script>
export default {
  name: 'TriggerCell',

  props: {
    row: Object,
  },
  methods: {
    openPanel() {
      this.$emit('colEvent', { action: 'openTriggerHistory', row: this.row });
    },
  },
};
</script>
