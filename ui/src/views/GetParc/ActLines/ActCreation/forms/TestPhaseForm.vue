<template>
  <div>
    <ActFormContainer :validate-fn="onValidate">
      <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
        <button @click="containerValidationFn" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
          <i class="ic-Arrow-Forward-Icon" />
          {{ $t('getparc.actCreation.phaseTest.end') }}
        </button>
        <div>
          {{ info }}
        </div>
      </div>
      <div slot="messages" class="text-warning">
        <span>
          <i class="ic-Alert-Icon" />
          {{ $t('getparc.actCreation.phaseTest.warningMsg') }}
        </span>
      </div>
    </ActFormContainer>
  </div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import { mapState, mapGetters } from 'vuex';
import { endPhaseTest } from '@/api/actCreation';

export default {
  components: {
    ActFormContainer,
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    total() {
      return this.selectedLinesForActCreation.length > 0
        ? this.selectedLinesForActCreation.length
        : 0;
    },
    info() {
      return this.total > 0
        ? `${this.$t('getparc.actCreation.SELECTED_LINES', { total: this.total })}`
        : '';
    },
  },
  methods: {
    async onValidate(contextValues) {
      return await endPhaseTest(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
