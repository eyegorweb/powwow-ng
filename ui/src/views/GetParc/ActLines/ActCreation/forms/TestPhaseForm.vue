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
        <span>
          <i class="ic-Alert-Icon" />
          {{ $t('getparc.actCreation.phaseTest.warningMsg') }}
        </span>
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
      return await endPhaseTest(this.appliedFilters, this.selectedLinesForActCreation, {
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
