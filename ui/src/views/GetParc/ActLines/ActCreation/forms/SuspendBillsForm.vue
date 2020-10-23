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

      return this.partner.partyType !== 'MVNO' && this.userIsBO && this.partner.suspendBilling;
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
      return await suspendLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: this.suspendBilling,
        nonModifiableParClient: this.notEditable,
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
