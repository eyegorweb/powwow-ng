<template>
  <ActFormContainer :validate-fn="onValidate" :warning-message="warningMessage">
    <div slot="messages" class="text-info">
      <div v-if="exceptionError">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <div class="text-danger">
          {{ exceptionError }}
        </div>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { reactivateLines } from '@/api/actCreation';
import { searchLineById } from '@/api/linesActions';
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
      return this.actCreationPrerequisites.partner;
    },
    // Services activés à l'initialisation
    listActivatedServices() {
      if (!this.offerServices) return [];
      return this.offerServices
        .filter(
          (s) =>
            s.checked &&
            !this.changedServices.find((cs) => {
              return s.code === cs.code;
            })
        )
        .map((s) => s.code);
    },
    // Services activés automatiquement
    listAutoServiceMandatory() {
      if (!this.offerServices) return [];
      return this.changedServices.filter((s) => s.checked).map((s) => s.code);
    },
    // Services désactivés automatiquement
    listAutoServiceIncompatible() {
      if (!this.offerServices) return [];
      return this.changedServices.filter((s) => !s.checked).map((s) => s.code);
    },
    warningMessage() {
      let list = '';
      let message = '';
      if (this.listActivatedServices.length > 0) {
        list += `${this.$t('services.listServiceMandatory')}: ${this.listActivatedServices
          .map((s) => s)
          .join(',')}`;
      }
      if (this.listAutoServiceMandatory.length > 0) {
        list += `<br />${this.$t(
          'services.listAutoServiceMandatory'
        )}: ${this.listAutoServiceMandatory.map((s) => s).join(',')}`;
      }
      if (this.listAutoServiceIncompatible.length > 0) {
        list += `<br />${this.$t(
          'services.listAutoServiceIncompatible'
        )}: ${this.listAutoServiceIncompatible.map((s) => s).join(',')}`;
      }
      if (!list) {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmAction')}`;
      } else {
        message = `${this.$t('getparc.actCreation.preactivateActivate.confirmationWarning', {
          list,
        })}`;
      }
      return message;
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
      const response = await reactivateLines(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        {
          suspendreFacturation: false,
          nonModifiableParClient: false,
          notifEmail: contextValues.notificationCheck,
          dueDate: contextValues.actDate,
          partyId: this.partner.id,
          tempDataUuid: contextValues.tempDataUuid,
        }
      );
      if (response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        console.log('formatted back errors', formatted);
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else {
            errorMessage = `${e.key}: ${e.value}`;
          }
        });
        if (massActionLimitError) {
          this.exceptionError = `${this.$t(
            'getparc.actCreation.report.errors.' + massActionLimitError,
            {
              count,
            }
          )}`;
        } else {
          this.exceptionError = errorMessage;
        }

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
