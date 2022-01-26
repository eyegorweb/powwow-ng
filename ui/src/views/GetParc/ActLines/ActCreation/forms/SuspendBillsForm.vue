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
        <div v-if="exceptionError">
          <h6 class="text-danger">{{ $t('errors.all') }}</h6>
          <div class="text-danger">
            {{ exceptionError }}
          </div>
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
import { getPartyOptions } from '@/api/partners.js';
import { formatBackErrors } from '@/utils/errors';

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
      exceptionError: undefined,
      partnerOptions: undefined,
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
      let suspensionFree = false;

      if (this.partnerOptions) {
        suspensionFree = this.partnerOptions.suspensionFree;
      }

      return this.partner.partyType !== 'MVNO' && this.userIsBO && suspensionFree;
    },
  },
  watch: {
    async partner() {
      this.refreshOptions();
    },
  },

  async mounted() {
    await this.loadSingleLineInfo();
    this.refreshOptions();
  },
  methods: {
    async refreshOptions() {
      if (this.partner) {
        this.partnerOptions = await getPartyOptions(this.partner.id);
      } else {
        this.partnerOptions = undefined;
      }
    },
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
