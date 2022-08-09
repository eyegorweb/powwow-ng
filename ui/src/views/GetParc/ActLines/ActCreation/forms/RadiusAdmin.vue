<template>
  <ActWithFileUploadContainer
    :act-mutation-fn="createRadiusAdmin"
    act-code="RADIUS"
    confirmation-message="confirmAction"
    ip-fix-usage
  >
    <div slot="action" class="mb-3">
      <h6>Action</h6>
      <Toggle
        v-if="toggleValues"
        @update="currentAction = $event.id"
        :values="toggleValues"
        class="pl-2"
      />
    </div>
  </ActWithFileUploadContainer>
</template>

<script>
import ActWithFileUploadContainer from './parts/ActWithFileUploadContainer';
import Toggle from '@/components/ui/UiToggle2';
import { createRadiusAdmin } from '@/api/actCreation';

export default {
  components: {
    ActWithFileUploadContainer,
    Toggle,
  },
  data() {
    return {
      currentAction: undefined,
      toggleValues: undefined,
    };
  },
  methods: {
    async createRadiusAdmin(params) {
      return await createRadiusAdmin(params, this.currentAction);
    },
  },
  mounted() {
    this.toggleValues = [
      {
        id: 'UPDATE',
        label: 'getparc.history.actions.UPDATE',
      },
      {
        id: 'READ',
        label: 'getparc.history.actions.CONSULT',
      },
      {
        id: 'SYNCHRONIZE',
        label: 'getparc.history.actions.SYNC',
      },
    ];
  },
};
</script>

<style lang="scss" scoped></style>
