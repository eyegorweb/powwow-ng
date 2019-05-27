<template>
  <div>
    {{ $t(simStatus) }}
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  props: {
    row: Object,
  },
  computed: {
    simStatus() {
      const commercialStatus = get(this.row, 'accessPoint.commercialStatus');
      const simStatus = get(this.row, 'accessPoint.simCardInstance.statuts');
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

      return get(this.row, 'accessPoint.simCardInstance.statuts');
    },
  },
};
</script>

<style lang="scss" scoped></style>
