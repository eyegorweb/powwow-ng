<template>
  <div>
    <ActFormContainer :validate-fn="onValidate" :apply-title="applyTitle" :message="message" :info="info">
      <i slot="iconTitle" class="ic-Arrow-Forward-Icon" />
      <i slot="iconMsg" class="ic-Alert-Icon" />
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
  data() {
    return {
      notEditable: false,
      suspendBilling: false,
      applyTitle: this.$t('getparc.actCreation.phaseTest.end'),
      message: {
        text: this.$t('getparc.actCreation.phaseTest.warningMsg'),
      },
    };
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
      return this.total > 0 ? `${this.total} lignes seront modifiées` : '';
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
