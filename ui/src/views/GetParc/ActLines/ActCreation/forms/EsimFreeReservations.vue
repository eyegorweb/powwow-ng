<template>
  <ActFormContainer :validate-fn="onValidate">
    <div slot="messages" class="text-info">
      <div v-if="requestErrors && requestErrors.length">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
        </ul>
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { esimLiberationProfil } from '@/api/esim.js';
import { mapState, mapGetters } from 'vuex';

export default {
  components: {
    ActFormContainer,
  },
  data() {
    return {
      requestErrors: [],
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

      const response = await esimLiberationProfil(
        partnerId,
        this.appliedFilters,
        simIds,
        contextValues.tempDataUuid,
        contextValues.actDate
      );
      if (response.errors && response.errors.length) {
        response.errors.forEach((r) => {
          if (r.extensions && r.extensions.error) {
            if (r.extensions.error === 'MassActionLimit') {
              const count = r.extensions && r.extensions.limit ? r.extensions.limit : '';
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
          }
        });
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
