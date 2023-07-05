<template>
  <ActFormContainer :validate-fn="onValidate">
    <div>
      <div v-if="profileStatuses" class="form-group">
        <label>{{ $t('status') }}</label>
        <UiSelect class="text-gray" block v-model="selectedStatus" :options="profileStatuses" />
      </div>
    </div>
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
import { esimStatusChangeProfil } from '@/api/esim.js';
import { searchLineById } from '@/api/linesActions';
import { mapState, mapGetters } from 'vuex';
import UiSelect from '@/components/ui/UiSelect';
import { formatBackErrors } from '@/utils/errors';

export default {
  components: {
    ActFormContainer,
    UiSelect,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    partnerId() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.$loGet(this.singleLineFound, 'party.id');
        }
      }
      return this.$loGet(this.actCreationPrerequisites, 'partner.id');
    },
  },
  data() {
    return {
      selectedStatus: undefined,
      profileStatuses: undefined,
      singleLineFound: undefined,
      exceptionError: undefined,
    };
  },
  async mounted() {
    this.profileStatuses = [
      {
        label: this.$t('filters.lines.profileStateFilter.ENABLED'),
        value: 'ENABLED',
      },
      {
        label: this.$t('filters.lines.profileStateFilter.DISABLED'),
        value: 'DISABLED',
      },
    ];
    await this.loadSingleLineInfo();
  },
  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        if (lineInTable) {
          this.singleLineFound = await searchLineById(lineInTable.id);
        }
      }
    },
    async onValidate(contextValues) {
      let simIds = [];
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }

      const response = await esimStatusChangeProfil({
        partnerId: this.partnerId,
        filters: this.appliedFilters,
        simCardInstanceIds: simIds,
        tempDataUuid: contextValues.tempDataUuid,
        dueDate: contextValues.actDate,
        notification: contextValues.notificationCheck,
        targetStateEnum: this.selectedStatus,
      });

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
