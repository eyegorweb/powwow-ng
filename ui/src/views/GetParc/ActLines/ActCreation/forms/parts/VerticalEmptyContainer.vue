<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-10">
          <slot name="main" />
          <slot name="bottom" :containerValidationFn="validate"></slot>
        </div>
        <div class="col-2">
          <div class="text-right">
            <button @click="clearForm" class="clear-form">
              {{ $t('cancel') }}
              <em class="ic-Cross-Icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <slot name="messages"></slot>
          <div class="row">
            <div
              class="col-7"
              v-if="tempDataUuid && validationErrors && validationErrors.errors.length"
            >
              <FormReport v-if="validationErrors" :data="validationErrors" />
              <button
                v-if="tempDataUuid"
                @click="doubleConfirm"
                class="btn btn-success pl-4 pr-4 pt-2 pb-2"
              >
                <em class="ic-Check-Icon" />
                {{ $t('confirm') }}
              </button>
            </div>
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
    noConfirmTranslation: Boolean,
    preventSend: Boolean,
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
      'resetState',
    ]),

    async validate() {
      setTimeout(() => {
        this.confirmAction({
          message: this.confirmMsg,
          noTranslation: this.noConfirmTranslation,
          actionFn: async () => {
            if (this.haveErrors()) return;

            const response = await this.validateFn({
              actDate: this.actDate,
              notificationCheck: this.notificationCheck,
            });

            if (!response) {
              this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
            }

            if (response) {
              if (response.errors && response.errors.length) {
                this.validationErrors = {
                  errors: response.errors,
                  validated: response.validationError
                    ? response.validationError.validated
                    : undefined,
                };
                this.tempDataUuid = response.validationError
                  ? response.validationError.tempDataUuid
                  : undefined;
              } else {
                this.onSuccess();
              }
            }
          },
        });
      });
    },

    onSuccess() {
      const successMessage = this.successMessage
        ? this.$t(this.successMessage)
        : this.$t('genericSuccessMessage');
      this.flashMessage({ level: 'success', message: successMessage });

      // sortir du mode création acte
      this.resetState();
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
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      }
    },

    haveErrors() {
      if (this.checkErrorsFn) {
        return this.checkErrorsFn();
      }

      return false;
    },

    clearForm() {
      this.resetState();
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
.clear-form {
  appearance: none;
  outline: none;
  border: none;
  background-color: transparent;
}
</style>
