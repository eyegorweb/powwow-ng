<template>
  <ActFormContainer :validate-fn="onValidate">
    <template v-if="partner">
      <div>
        <div class="row" v-if="!userIsPartner">
          <div class="col d-flex">
            <UiCheckbox v-model="notEditable" />
            <span>{{ $t('getparc.actCreation.suspend.notEditable') }}</span>
          </div>
        </div>
        <div v-if="canSuspendBilling" class="row">
          <div class="col d-flex">
            <UiCheckbox v-model="suspendBilling" />
            <span>{{ $t('getparc.actCreation.suspend.suspendBilling') }}</span>
          </div>
        </div>
      </div>
      <div slot="messages" class="text-info">
        <div v-if="requestErrors && requestErrors.length">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <ul class="text-danger list-unstyled">
            <li v-for="error in requestErrors" :key="error.message">{{ error.message }}</li>
          </ul>
        </div>
      </div>
    </template>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapState, mapGetters } from 'vuex';
import { suspendLines } from '@/api/actCreation';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
    UiCheckbox,
  },
  data() {
    return {
      notEditable: false,
      suspendBilling: false,
      singleLineFound: undefined,
      requestErrors: [],
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userIsBO', 'userIsPartner']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    canSuspendBilling() {
      if (!this.actCreationPrerequisites) return false;

      return (
        this.partner.partyType !== 'MVNO' &&
        this.userIsBO &&
        (this.partner.suspendBilling || this.partner.suspensionFree)
      );
    },
  },
  async mounted() {
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
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    async onValidate(contextValues) {
      const response = await suspendLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: this.suspendBilling,
        nonModifiableParClient: this.notEditable,
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
      if (response.errors && response.errors.length) {
        response.errors.forEach(r => {
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
