<template>
  <div>
    <ActFormContainer
      :validate-fn="onValidate"
      disabled-notification-check
      :can-change-date="false"
      fix-on-current-date
    >
      <div slot="messages" class="text-info">
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
        </div>
      </div>
    </ActFormContainer>
  </div>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { pairingByStockedEid } from '@/api/esim.js';
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
    async onValidate() {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      const simCardTypeId = this.$loGet(this.actCreationPrerequisites, 'simcardType.id');
      let simCardInstanceIds = [];
      if (this.selectedLinesForActCreation) {
        simCardInstanceIds = this.selectedLinesForActCreation.map((a) => a.id);
      }

      const response = await pairingByStockedEid(
        partnerId,
        this.appliedFilters,
        simCardTypeId,
        simCardInstanceIds
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
          } else if (e.key === 'eid') {
            errorMessage = this.$t('getparc.actCreation.report.errors.eid');
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

<style lang="scss" scoped>
.dropZone {
  width: 100%;
}
</style>
