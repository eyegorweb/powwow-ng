<template>
  <div>
    {{ dateStatus }}
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  props: {
    row: Object,
  },
  computed: {
    dateStatus() {
      const commercialStatus = get(this.row, 'accessPoint.commercialStatus');
      const simStatus = get(this.row, 'accessPoint.simCardInstance.statuts');
      const networkStatus = get(this.row, 'accessPoint.networkStatus');

      const lineIsNotPreactivated = simStatus === 'AVAILABLE';
      const lineIsPreactivated = simStatus === 'ALLOCATED' && !commercialStatus;
      const lineIsActivated = simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED';
      const lineIsSuspended = simStatus === 'ALLOCATED' && networkStatus === 'SUSPENDED';
      const lineIsReleased = simStatus === 'RELEASED';

      if (lineIsNotPreactivated) {
        return get(this.row, 'accessPoint.simCardInstance.auditable.created');
      }

      if (lineIsPreactivated) {
        return get(this.row, 'accessPoint.simCardInstance.auditable.created');
      }

      if (lineIsActivated) {
        return get(this.row, 'accessPoint.activationDate');
      }

      if (lineIsSuspended || lineIsReleased) {
        return get(this.row, 'accessPoint.commercialStatusDate');
      }

      return '-';
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  font-size: 0.8rem;
}
</style>
