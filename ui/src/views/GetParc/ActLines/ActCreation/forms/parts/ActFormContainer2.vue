<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <slot />
          <div v-if="!excludeDefaultFields">
            <div class="row">
              <div class="col d-flex">
                <UiCheckbox v-model="notificationCheck" />
                <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <UiDate
                  @change="onActDateChange"
                  :value="actDate"
                  :error="dateError"
                  class="d-block"
                  fixed
                >
                  <i slot="icon" class="select-icon ic-Flag-Icon" />
                </UiDate>
              </div>
              <div class="col">
                <slot
                  name="validate-btn-content"
                  :containerValidationFn="validate"
                  :actDate="actDate"
                  :notificationCheck="notificationCheck"
                >
                  <button @click="validate" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
                    <span>{{ $t('set') }}</span>
                  </button>
                </slot>
              </div>
            </div>
          </div>
          <slot v-else name="validate-btn-content" :containerValidationFn="validate"></slot>
          <slot name="bottom" :containerValidationFn="validate"></slot>
        </div>
        <div class="col-5">
          <div class="text-right">
            <button @click="clearForm" class="clear-form">
              {{ $t('cancel') }}
              <i class="ic-Cross-Icon" />
            </button>
          </div>
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
import UiDate from '@/components/ui/UiDate';
import UiCheckbox from '@/components/ui/Checkbox';
import { mapMutations } from 'vuex';
import moment from 'moment';
import FormReport from './FormReport';

export default {
  components: {
    UiDate,
    UiCheckbox,
    FormReport,
  },

  props: {
    validateFn: Function,
    checkErrorsFn: Function,
    excludeDefaultFields: Boolean,
    successMessage: String,
    noModal: Boolean,
  },

  data() {
    return {
      actDate: null,
      dateError: null,
      notificationCheck: false,
      validationErrors: undefined,
      tempDataUuid: undefined,
    };
  },

  mounted() {
    this.actDate = moment().format('DD/MM/YYYY hh:mm:ss');
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction']),
    ...mapMutations('actLines', [
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),

    onActDateChange(value) {
      this.$emit('update:date', value);
      this.actDate = value;
    },

    async validate() {
      const actionFn = async () => {
        this.tempDataUuid = undefined;
        if (this.haveErrors()) return;

        const response = await this.validateFn({
          actDate: this.actDate,
          notificationCheck: this.notificationCheck,
        });

        if (response) {
          if (response.errors && response.errors.length) {
            this.validationErrors = { errors: response.errors };
            this.tempDataUuid = response.tempDataUuid;
          } else {
            this.onSuccess();
          }
        } else {
          this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
        }
      };

      if (this.noModal) {
        await actionFn();
      } else {
        this.confirmAction({
          message: 'confirmAction',
          actionFn,
        });
      }
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

    haveErrors() {
      if (this.checkErrorsFn) {
        return this.checkErrorsFn();
      }

      if (this.excludeDefaultFields) return false;

      this.dateError = undefined;
      if (!this.actDate) {
        this.dateError = 'errors.mandatory';
        return true;
      }
      return false;
    },
    clearForm() {
      this.setActToCreate(null);
      this.setActCreationPrerequisites(null);
      this.setSelectedLinesForActCreation([]);
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
