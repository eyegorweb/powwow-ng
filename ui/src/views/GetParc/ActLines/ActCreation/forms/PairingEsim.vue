<template>
  <ActFormContainer :validate-fn="onValidate"></ActFormContainer>
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
    async onValidate(contextValues) {
      console.log(
        '🚀 ~ file: PairingEsim.vue ~ line 14 ~ onValidate ~ contextValues',
        contextValues
      );
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      const simCardTypeId = this.$loGet(this.actCreationPrerequisites, 'simcardType.id');
      let simCardInstanceIds = [];
      if (this.selectedLinesForActCreation) {
        simCardInstanceIds = this.selectedLinesForActCreation.map((a) => a.id);
      }

      return await pairingByStockedEid(
        partnerId,
        this.appliedFilters,
        simCardTypeId,
        simCardInstanceIds
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
