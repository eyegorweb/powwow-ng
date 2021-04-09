<template>
  <div>
    {{ details }}
    <Tooltip direction="right">({{ $t('getsim.stocks.table.nbPairing') }})</Tooltip>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';

export default {
  components: {
    Tooltip,
  },
  props: {
    row: Object,
  },

  computed: {
    details() {
      return `${this.$loGet(this.row, 'stockNoPreactAppaire')}/${this.$loGet(
        this.row,
        'stockNoPreactNoAppaire'
      )}`;
    },
  },
};
</script>

<style lang="scss" scoped></style>
