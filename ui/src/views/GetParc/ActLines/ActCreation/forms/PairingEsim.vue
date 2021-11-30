<template>
  <div>
    <ActFormContainer
      :validate-fn="onValidate"
      disabled-notification-check
      :can-change-date="false"
      fix-on-current-date
    >
    </ActFormContainer>
  </div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { pairingByStockedEid } from '@/api/esim.js';

export default {
  components: {
    ActFormContainer,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
  },
  methods: {
    async onValidate() {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      const simCardTypeId = this.$loGet(this.actCreationPrerequisites, 'simcardType.id');
      let simCardInstanceIds = [];
      if (this.selectedLinesForActCreation) {
        simCardInstanceIds = this.selectedLinesForActCreation.map((a) => a.id);
      }

      return pairingByStockedEid(partnerId, this.appliedFilters, simCardTypeId, simCardInstanceIds);
    },
  },
};
</script>

<style lang="scss" scoped>
.dropZone {
  width: 100%;
}
</style>
