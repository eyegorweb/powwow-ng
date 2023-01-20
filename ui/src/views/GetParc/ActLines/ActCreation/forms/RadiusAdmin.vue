<template>
  <ActWithFileUploadContainer
    :act-mutation-fn="createRadiusAdmin"
    :act-code="actCode"
    always-show-report
    confirmation-message="confirmAction"
    ip-fix-usage
    validation-tr
  >
    <div slot="action" class="mb-3">
      <h6>Action</h6>
      <div class="mb-3">
        <Toggle
          v-if="toggleValues"
          @update="currentAction = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
      </div>
      <div class="row" v-if="currentAction === 'UPDATE'">
        <div class="col d-flex">
          <UiCheckbox v-model="resetEmptyField" />
          <span>{{ $t('getparc.actCreation.radius.RADIUS_EMPTY_OPTION') }}</span>
        </div>
      </div>
    </div>
  </ActWithFileUploadContainer>
</template>

<script>
import ActWithFileUploadContainer from './parts/ActWithFileUploadContainer';
import Toggle from '@/components/ui/UiToggle2';
import UiCheckbox from '@/components/ui/Checkbox';
import { createRadiusAdmin } from '@/api/actCreation';

export default {
  components: {
    ActWithFileUploadContainer,
    Toggle,
    UiCheckbox,
  },
  data() {
    return {
      currentAction: undefined,
      toggleValues: undefined,
      resetEmptyField: false,
    };
  },
  methods: {
    async createRadiusAdmin(params) {
      if (this.currentAction !== 'UPDATE') {
        this.resetEmptyField = false;
      }
      return await createRadiusAdmin(params, this.currentAction, this.resetEmptyField);
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
  computed: {
    actCode() {
      let code = 'RADIUS';
      if ('READ' === this.currentAction) {
        code += '_READ';
      }
      return code;
    },
  },
};
</script>

<style lang="scss" scoped></style>
