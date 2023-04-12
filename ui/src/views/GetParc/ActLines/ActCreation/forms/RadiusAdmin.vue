<template>
  <ActWithFileUploadRestriction
    :act-mutation-fn="createRadiusAdmin"
    :act-code="actCode"
    always-show-report
    validation-bloc-right-fixed
  >
    <div slot="action" class="mb-3" v-if="toggleValues && toggleValues.length > 0">
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
      <div v-else class="row">&nbsp;</div>
    </div>
  </ActWithFileUploadRestriction>
</template>

<script>
import ActWithFileUploadRestriction from './parts/ActWithFileUploadRestriction';
import Toggle from '@/components/ui/UiToggle2';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapGetters } from 'vuex';
import { createRadiusAdmin } from '@/api/actCreation';

export default {
  components: {
    ActWithFileUploadRestriction,
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
    if (this.havePermission('act', 'radius_administration')) {
      this.toggleValues = [
        {
          id: 'UPDATE',
          label: 'getparc.history.actions.UPDATE',
        },
      ];
    } else {
      this.toggleValues = [];
    }
    if (this.havePermission('act', 'radius_read')) {
      this.toggleValues.push({
        id: 'READ',
        label: 'getparc.history.actions.CONSULT',
      });
    }
    if (this.havePermission('act', 'radius_synchronize')) {
      this.toggleValues.push({
        id: 'SYNCHRONIZE',
        label: 'getparc.history.actions.SYNC',
      });
    }
  },
  computed: {
    ...mapGetters(['havePermission']),
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
