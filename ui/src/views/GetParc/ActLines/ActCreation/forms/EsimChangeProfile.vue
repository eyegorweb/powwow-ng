<template>
  <ActFormContainer :validate-fn="onValidate">
    <div>
      <div v-if="profileStatuses" class="form-group">
        <label>{{ $t('status') }}</label>
        <UiSelect class="text-gray" block v-model="selectedStatus" :options="profileStatuses" />
      </div>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import { esimStatusChangeProfil } from '@/api/esim.js';
import { mapState, mapGetters } from 'vuex';
import UiSelect from '@/components/ui/UiSelect';

export default {
  components: {
    ActFormContainer,
    UiSelect,
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
  },
  data() {
    return {
      selectedStatus: undefined,
      profileStatuses: undefined,
    };
  },
  mounted() {
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
  },
  methods: {
    async onValidate(contextValues) {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      let simIds;
      if (this.selectedLinesForActCreation && this.selectedLinesForActCreation.length) {
        simIds = this.selectedLinesForActCreation.map((s) => s.id);
      }

      return await esimStatusChangeProfil({
        partnerId,
        filters: this.appliedFilters,
        simCardInstanceIds: simIds,
        tempDataUuid: contextValues.tempDataUuid,
        dueDate: contextValues.actDate,
        notification: contextValues.notificationCheck,
        targetStateEnum: this.selectedStatus,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
