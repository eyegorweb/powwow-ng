<template>
  <div>{{ $t(simStatus) }}</div>
</template>

<script>
import get from 'lodash.get';

export default {
  name: 'SimStatusCell',
  props: {
    row: Object,
  },
  computed: {
    simStatus() {
      const commercialStatus = get(this.row, 'accessPoint.commercialStatus');
      const simStatus = get(this.row, 'statuts');
      const networkStatus = get(this.row, 'accessPoint.networkStatus');

      if (simStatus === 'AVAILABLE') {
        return 'getparc.actLines.simStatuses.NOT_PREACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && !commercialStatus) {
        return 'getparc.actLines.simStatuses.PREACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && !networkStatus) {
        return 'getparc.actLines.simStatuses.ACTIVATING';
      }
      if (simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED') {
        return 'getparc.actLines.simStatuses.ACTIVATED';
      }
      if (simStatus === 'ALLOCATED' && networkStatus === 'SUSPENDED') {
        return 'getparc.actLines.simStatuses.SUSPENDED';
      }
      if (simStatus === 'RELEASED') {
        return 'getparc.actLines.simStatuses.RELEASED';
      }
      if (simStatus === 'ALLOCATING') {
        return 'getparc.actLines.simStatuses.ALLOCATING';
      }

      return get(this.row, 'statuts');
    },
  },
};
</script>

<style lang="scss" scoped></style>
