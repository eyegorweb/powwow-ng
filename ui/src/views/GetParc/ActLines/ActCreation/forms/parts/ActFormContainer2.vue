<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-7">
          <slot />
          <div v-if="!excludeDefaultFields">
            <ff-wip>
              <div class="row" v-if="!disabledNotificationCheck">
                <div class="col d-flex">
                  <UiCheckbox v-model="notificationCheck" />
                  <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
                </div>
              </div>
            </ff-wip>
            <div class="row">
              <div class="col" v-if="canChangeDate && !noDate">
                <UiDate
                  @change="onActDateChange"
                  :value="actDate"
                  :error="dateError"
                  class="d-block"
                  :min-date="minDate"
                  time-picker
                  fixed
                >
                  <i slot="icon" class="select-icon ic-Flag-Icon" />
                </UiDate>
              </div>
              <div v-else-if="!noDate" class="col">
                <div class="ml-1 mt-2">
                  <span>
                    <i class="icon ic-Calendar-Icon"></i>
                  </span>
                  <span class="col">{{ actDate }}</span>
                </div>
              </div>
              <div class="col">
                <slot
                  name="validate-btn-content"
                  :containerValidationFn="validate"
                  :actDate="actDate"
                  :notificationCheck="notificationCheck"
                >
                  <button
                    @click="validate"
                    :disabled="preventSend"
                    class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
                  >
                    <span>{{ confirmLabel ? $t(confirmLabel) : $t('set') }} </span>
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
          <div
            v-if="
              tempDataUuid &&
                validationErrors &&
                validationErrors.errors.length &&
                !requestExceptionsErrors
            "
          >
            <FormReport
              v-if="validationErrors"
              :data="validationErrors"
              :get-export-fn="getExportFn()"
            />
            <button
              :disabled="!validationErrors.validated"
              @click="doubleConfirm"
              class="btn btn-double-validation pl-4 pr-4 pt-2 pb-2"
              :class="{
                'btn-success': validationErrors.validated,
                'btn-light': !validationErrors.validated,
              }"
            >
              <i v-if="validationErrors.validated" class="ic-Check-Icon" />
              {{ $t('confirm') }}
            </button>
          </div>

          <div
            v-else-if="
              !tempDataUuid &&
                validationErrors &&
                validationErrors.errors.length &&
                !!requestExceptionsErrors
            "
          >
            <ul class="list-unstyled m-0 mt-2">
              <li class="item" v-for="e in validationErrors.errors" :key="e.key">
                <div
                  v-if="e.key === 400 && e.error === 'FILE_LINE_NUMBER_INVALID'"
                  class="alert alert-danger"
                  role="alert"
                >
                  {{ $t('getparc.actCreation.report.FILE_LINE_NUMBER_INVALID') }}
                </div>
                <div
                  v-else-if="e.key === 400 && e.error === 'FILE_MAX_LINE_NUMBER_INVALID'"
                  class="alert alert-danger"
                  role="alert"
                >
                  {{
                    $t('getparc.actCreation.report.FILE_MAX_LINE_NUMBER_INVALID', {
                      count: e.data.maxNumbersPerFileUpload,
                    })
                  }}
                </div>
                <div
                  v-else-if="e.key === 422 && e.error === 'FILE_CONTENT_INVALID'"
                  class="alert alert-danger"
                  role="alert"
                >
                  {{ $t('getparc.actCreation.report.FILE_CONTENT_INVALID') }}
                </div>
                <div v-else-if="e.key === 500" class="alert alert-warning" role="alert">
                  {{ $t('getparc.actCreation.report.timeout') }}
                </div>
                <div v-else class="alert alert-danger" role="alert">
                  {{ $t('getparc.actCreation.report.' + e.error) }}
                </div>
              </li>
            </ul>
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
import { exportLinesFromFileFilter } from '@/api/linesActions';

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
    confirmLabel: String,
    successMessage: String,
    warningMessage: { type: String, default: 'confirmAction' },
    noModal: Boolean,
    preventSend: Boolean,
    partnerType: String,
    disabledNotificationCheck: Boolean,
    noDate: Boolean,
    canChangeDate: {
      type: Boolean,
      default: true,
    },
    fixOnCurrentDate: Boolean,
    file: File,
  },

  data() {
    return {
      actDate: null,
      dateError: null,
      notificationCheck: false,
      tempDataUuid: undefined,
      validationErrors: undefined,
    };
  },

  mounted() {
    this.formatteDueDate();
  },

  computed: {
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
    requestExceptionsErrors() {
      if (!this.validationErrors) return false;
      return this.validationErrors.errors.find(
        (f) => f.key === 400 || f.key === 422 || f.key === 500
      );
    },
  },

  watch: {
    file(newFile, oldFile) {
      if (newFile && oldFile) {
        if (newFile.name !== oldFile.name) {
          this.validationErrors = undefined;
        }
      }
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'confirmAction', 'setPendingExportsStatus']),
    ...mapMutations('actLines', ['resetState']),

    onActDateChange(value) {
      this.$emit('update:date', value);
      this.actDate = value;
    },

    async validate() {
      const actionFn = async () => {
        this.tempDataUuid = undefined;
        const response = await this.validateFn({
          actDate: this.actDate,
          notificationCheck: this.notificationCheck,
        });

        if (response) {
          if (response.errors && response.errors.length) {
            this.validationErrors = {
              errors: response.errors,
              validated: response.validationError ? response.validationError.validated : undefined,
            };
            this.tempDataUuid = response.validationError
              ? response.validationError.tempDataUuid
              : undefined;
          } else {
            // pas de lignes ko, que des lignes ok, on lance la mutation et on ferme l'acte
            this.onSuccess();
          }
        } else {
          this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        }
      };

      if (this.haveErrors()) return;

      if (this.noModal) {
        await actionFn();
      } else {
        this.confirmAction({
          message: this.warningMessage,
          actionFn,
          listStyle: !!this.warningMessage,
        });
      }
    },

    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        return await exportLinesFromFileFilter(
          ['DATA', 'STATUS'],
          '',
          exportFormat,
          this.tempDataUuid
        );
      };
    },

    async doubleConfirm() {
      // il y a des lignes ko et des lignes ok, on lance alors la mutation uniquement pour les lignes ok
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

    onSuccess() {
      const successMessage = this.successMessage
        ? this.$t(this.successMessage)
        : this.$t('genericSuccessMessage');
      this.flashMessage({ level: 'success', message: successMessage });

      // ajouter l'acte à la liste des opérations en cours du module PendingActions
      this.setPendingExportsStatus(true);

      // sortir du mode création acte
      this.resetState();
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
      this.resetState();
    },

    formatteDueDate() {
      if (this.canChangeDate) {
        if (this.partnerType !== 'CUSTOMER') {
          this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
        } else {
          this.actDate = moment()
            .add(1, 'month')
            .startOf('month')
            .subtract(1, 'day')
            .format('DD/MM/YYYY 23:59:59');
        }
      } else {
        if (this.fixOnCurrentDate) {
          this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
        } else {
          if (this.partnerType !== 'CUSTOMER') {
            this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
          } else {
            this.actDate = moment()
              .add(1, 'month')
              .startOf('month')
              .subtract(1, 'day')
              .format('DD/MM/YYYY 23:59:59');
          }
        }
      }
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
