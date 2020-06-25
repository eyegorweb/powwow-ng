<template>
  <ActFormContainer :validate-fn="onValidate">
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
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapState, mapGetters } from 'vuex';
import { suspendLines } from '@/api/actCreation';

export default {
  components: {
    ActFormContainer,
    UiCheckbox,
  },
  data() {
    return {
      notEditable: false,
      suspendBilling: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapGetters(['userIsBO', 'userIsPartner']),
    canSuspendBilling() {
      if (!this.actCreationPrerequisites) return false;

      return (
        this.actCreationPrerequisites.partner.partyType !== 'MVNO' &&
        this.userIsBO &&
        this.actCreationPrerequisites.partner.suspensionFree
      );
    },
  },
  methods: {
    async onValidate(contextValues) {
      return await suspendLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: this.suspendBilling,
        nonModifiableParClient: this.notEditable,
        notifEmail: contextValues.notificationCheck,
        dueDate: contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,
        tempDataUuid: contextValues.tempDataUuid,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
