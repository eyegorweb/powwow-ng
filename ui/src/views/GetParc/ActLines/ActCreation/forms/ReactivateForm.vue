<template>
  <ActFormContainer :validate-fn="onValidate" />
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { mapState, mapGetters } from 'vuex';
import { reactivateLines } from '@/api/actCreation2';

export default {
  components: {
    ActFormContainer,
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
  },
  methods: {
    async onValidate(contextValues) {
      return await reactivateLines(this.appliedFilters, this.selectedLinesForActCreation, {
        suspendreFacturation: false,
        nonModifiableParClient: false,
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
