<template>
  <div>
    <slot name="content" :lineStatus="lineStatus" :dateStatus="dateStatus">
      {{ dateStatus }}
    </slot>
  </div>
</template>

<script>
import get from 'lodash.get';

export default {
  name: 'DateStatus',
  props: {
    row: Object,
  },
  computed: {
    commercialStatusDate() {
      return get(this.row, 'accessPoint.commercialStatusDate');
    },
    lineStatus() {
      const commercialStatus = get(this.row, 'accessPoint.commercialStatus');
      const simStatus = get(this.row, 'statuts');
      const networkStatus = get(this.row, 'accessPoint.networkStatus');

      const lineIsNotPreactivated = simStatus === 'AVAILABLE';
      const lineIsPreactivated = simStatus === 'ALLOCATED' && !commercialStatus;
      const lineIsActivated = simStatus === 'ALLOCATED' && networkStatus === 'ACTIVATED';
      const lineIsSuspended = simStatus === 'ALLOCATED' && networkStatus === 'SUSPENDED';
      const lineIsReleased = simStatus === 'RELEASED';

      if (lineIsNotPreactivated) {
        return 'LINE_NOT_PREACTIVATED';
      }

      if (lineIsPreactivated) {
        return 'LINE_IS_PREACTIVATED';
      }

      if (lineIsActivated) {
        return 'LINE_IS_ACTIVATED';
      }

      if (lineIsSuspended) {
        return 'LINE_IS_SUSPENDED';
      }

      if (lineIsReleased) {
        return 'LINE_IS_RELEASED';
      }

      return undefined;
    },
    dateStatus() {
      if (!this.commercialStatusDate) {
        if (this.lineStatus === 'LINE_NOT_PREACTIVATED') {
          return get(this.row, 'auditable.created');
        }

        if (this.lineStatus === 'LINE_IS_PREACTIVATED') {
          return get(this.row, 'accessPoint.preactivationDate');
        }

        if (this.lineStatus === 'LINE_IS_ACTIVATED') {
          return get(this.row, 'accessPoint.activationDate');
        }

        if (this.lineStatus === 'LINE_IS_SUSPENDED' || this.lineStatus === 'LINE_IS_RELEASED') {
          return get(this.row, 'accessPoint.commercialStatusDate');
        }
      }
      return this.commercialStatusDate;
    },
  },
};
</script>

<style lang="scss" scoped>
div {
  font-size: 0.8rem;
}
</style>
