<template>
  <ActFormContainer :validate-fn="onValidate"> </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import { mapState, mapGetters } from 'vuex';
import { reactivateLines } from '@/api/actCreation';

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
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
