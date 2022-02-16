<template>
  <ActFormContainer :validate-fn="onValidate" no-date disabled-notification-check>
    <div>
      <div slot="messages" class="text-info">
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { auditESIM } from '@/api/esim.js';
import { mapState, mapGetters } from 'vuex';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
  },
  data() {
    return {
      exceptionError: undefined,
    };
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
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }
      const response = await auditESIM({
        filters: this.appliedFilters,
        partyId: partnerId,
        simCardInstanceIds: simIds,
        tempDataUuid: contextValues.tempDataUuid,
      });

      if (response.errors && response.errors.length) {
        let errorMessage = '';
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          errorMessage = `${e.key}: ${e.value}`;
        });
        this.exceptionError = errorMessage;

        return {
          errors: response.errors,
          validationError: {
            validated: response.validated,
            tempDataUuid: response.tempDataUuid,
          },
        };
      }
      return response;
    },
  },
};
</script>

<style lang="scss" scoped></style>
