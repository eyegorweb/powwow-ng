<template>
  <div>
    <div class="mb-2">
      <DropZone v-model="selectedFile" class="dropZone" />
    </div>

    <ActFormContainer :validate-fn="onValidate"> </ActFormContainer>
  </div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { pairingByStockedEid } from '@/api/esim.js';
import DropZone from '@/components/ui/DropZone';

export default {
  components: {
    ActFormContainer,
    DropZone,
  },
  data() {
    return {
      selectedFile: undefined,
    };
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
