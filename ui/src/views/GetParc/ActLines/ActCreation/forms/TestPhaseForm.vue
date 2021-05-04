<template>
  <div>
    <ActFormContainer :validate-fn="onValidate">
      <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
        <button @click="containerValidationFn" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
          <i class="ic-Arrow-Forward-Icon" />
          {{ $t('getparc.actCreation.phaseTest.end') }}
        </button>
        <div>{{ info }}</div>
      </div>
      <div slot="messages" class="text-warning">
        <div>
          <i class="ic-Alert-Icon" />
          {{ $t('getparc.actCreation.phaseTest.warningMsg') }}
        </div>
        <div v-if="requestErrors && requestErrors.length">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <ul class="text-danger list-unstyled">
            <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
          </ul>
        </div>
      </div>
    </ActFormContainer>
  </div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { endPhaseTest } from '@/api/actCreation';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
  },

  data() {
    return {
      singleLineFound: undefined,
      requestErrors: [],
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
      return this.actCreationPrerequisites.partner;
    },
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
      const response = await endPhaseTest(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
      if (response.errors && response.errors.length) {
        response.errors.forEach((r) => {
          if (r.extensions && r.extensions.error && r.extensions.error === 'MassActionLimit') {
            const count = r.extensions.limit ? r.extensions.limit : '';
            const messageErrorMaxLine = this.$t(
              'getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID',
              {
                count,
              }
            );
            this.requestErrors = [
              {
                message: messageErrorMaxLine,
              },
            ];
          } else {
            this.requestErrors = [
              {
                message: r.message,
              },
            ];
          }
        });
        return { errors: response.errors };
      }
      return response;
    },
  },
};
</script>

<style lang="scss" scoped></style>
