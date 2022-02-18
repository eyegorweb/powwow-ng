<template>
  <ActFormContainer :validate-fn="onValidate" no-date disabled-notification-check>
    <div>
      <div slot="messages" class="text-info mb-3">
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
import { searchLineById } from '@/api/linesActions';
import { mapState, mapGetters } from 'vuex';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
  },
  data() {
    return {
      singleLineFound: undefined,
      exceptionError: undefined,
    };
  },
  async mounted() {
    await this.loadSingleLineInfo();
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.$loGet(this.actCreationPrerequisites, 'partner');
    },
  },
  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    async onValidate(contextValues) {
      let simIds = '';
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }
      const response = await auditESIM({
        filters: this.appliedFilters,
        partyId: this.partner.id,
        simCardInstanceIds: simIds,
        tempDataUuid: contextValues.tempDataUuid,
      });

      if (response.errors && response.errors.length) {
        let errorMessage = '';
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (
            (e.key === 'partyId' && e.value === 'DISABLED_AUDIT_OPTION') ||
            (e.key === 'service' && e.value === 'CONNECTION')
          ) {
            errorMessage = `${this.$t(
              'getparc.actCreation.report.errors.' + e.key + '.' + e.value
            )}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
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
