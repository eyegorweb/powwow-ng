<template>
  <div>
    <GenericDataGraph :usage-data="dataUsageStream" />
  </div>
</template>

<script>
import GenericDataGraph from './GenericDataGraph';

export default {
  components: {
    GenericDataGraph,
  },
  props: {
    dataUsageStream: Array,
  },
};
</script>

<style lang="scss" scoped></style>
