<template>
  <ActFormContainer :validate-fn="onValidate">
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
import { esimLiberationProfil } from '@/api/esim.js';
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
      let simIds = [];
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }

      const response = await esimLiberationProfil(
        partnerId,
        this.appliedFilters,
        simIds,
        contextValues.tempDataUuid,
        contextValues.actDate
      );
      if (response && response.errors && response.errors.length) {
        let errorMessage = '',
          massActionLimitError = '',
          count;
        const formatted = formatBackErrors(response.errors)
          .map((e) => e.errors)
          .flat();
        formatted.forEach((e) => {
          if (e.key === 'limit') {
            count = e.value;
          }
          if (e.key === 'error') {
            massActionLimitError = `${e.key}.${e.value}`;
          } else if (
            e.value === 'MANDATORY_SERVICE_NOT_FOUND' ||
            e.value === 'INCOMPATIBLE_SERVICE' ||
            e.value === 'MANDATORY_SERVICE'
          ) {
            let service = e.key;
            errorMessage = `${this.$t('getparc.actCreation.report.' + e.value, {
              service,
            })}`;
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
