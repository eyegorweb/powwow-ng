<template>
  <IdCellOpenPanel title="getvsion.alarm-detail" :row="row" />
</template>

<script>
import IdCellOpenPanel from '@/components/DataTable/IdCellOpenPanel';

export default {
  name: 'AlarmIdCell',
  props: {
    row: Object,
  },
  components: {
    IdCellOpenPanel,
  },
};
</script>

<style lang="scss" scoped></style>
