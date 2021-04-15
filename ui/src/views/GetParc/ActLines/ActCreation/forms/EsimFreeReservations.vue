<template>
  <ActFormContainer :validate-fn="onValidate"></ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { esimLiberationProfil } from '@/api/esim.js';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    ActFormContainer,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
  },
  methods: {
    async onValidate(contextValues) {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      let simIds;
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map(s => s.id);
      }

      return await esimLiberationProfil(
        partnerId,
        this.appliedFilters,
        simIds,
        contextValues.tempDataUuid,
        contextValues.actDate
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
