<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <slot name="main" :containerValidationFn="validate" />
          <slot name="bottom"></slot>
        </div>
        <div class="col-5">
          <slot name="messages"></slot>
          <div v-if="tempDataUuid && validationErrors && validationErrors.errors.length">
            <FormReport v-if="validationErrors" :data="validationErrors" />
            <button
              v-if="tempDataUuid"
              @click="doubleConfirm"
              class="btn btn-success pl-4 pr-4 pt-2 pb-2"
            >
              <i class="ic-Check-Icon" />
              {{ $t('confirm') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import FormReport from './FormReport';

export default {
  components: {
    FormReport,
  },

  props: {
    validateFn: Function,
    checkErrorsFn: Function,
    successMessage: String,
    confirmMsg: {
      type: String,
      default: 'confirmAction',
    },
  },
  data() {
    return {
      validationErrors: undefined,
      tempDataUuid: undefined,
    };
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),
    ...mapMutations('actLines', [
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),

    async validate() {
      this.confirmAction({
        message: this.confirmMsg,
        actionFn: async () => {
          if (this.haveErrors()) return;

          const response = await this.validateFn({
            actDate: this.actDate,
            notificationCheck: this.notificationCheck,
          });

          if (!response) {
            this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
          }

          if (response) {
            if (response.errors && response.errors.length) {
              this.validationErrors = { errors: response.errors };
              this.tempDataUuid = response.tempDataUuid;
            } else {
              this.onSuccess();
            }
          }
        },
      });
    },

    onSuccess() {
      const successMessage = this.successMessage
        ? this.$t(this.successMessage)
        : 'Opération effectuée avec succès';
      this.flashMessage({ level: 'success', message: successMessage });

      // sortir du mode création acte
      this.setActToCreate(null);
      this.setActCreationPrerequisites(null);
      this.setSelectedLinesForActCreation([]);
    },

    async doubleConfirm() {
      const response = await this.validateFn({
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
        tempDataUuid: this.tempDataUuid,
      });
      if (response) {
        this.onSuccess();
      } else {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }
    },

    haveErrors() {
      if (this.checkErrorsFn) {
        return this.checkErrorsFn();
      }

      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.to-bottom {
  align-items: flex-end;
  display: flex;
  margin-bottom: 1rem;
}
</style>
