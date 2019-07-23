<template>
  <BaseDetailPanelContent>
    <div class="overview-container m-3 bg-white">
      <slot></slot>

      <div class="row mt-2">
        <div class="col d-flex">
          <UiCheckbox v-model="notificationCheck" />
          <span>{{ $t('getparc.actCreation.NOTIFICATION_CHECK') }}</span>
        </div>
      </div>

      <div class="overview-item row">
        <div class="col">
          <h6>{{ $t('applyDate') }} :</h6>

          <UiDate
            @change="onActDateChange"
            :value="actDate"
            class="d-block large-date-picker"
            fixed
            large
          ></UiDate>
        </div>
        <div class="col">
          <button @click="askForConfirmation()" class="btn btn-primary pl-4 pr-4 pt-2 pb-2 mt-4">
            <i slot="icon" class="pr-2 select-icon ic-Floppy-Icon" />

            <span>{{ $t('set') }}</span>
          </button>
        </div>
      </div>
      <FormReport v-if="report" :data="report" />
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiDate from '@/components/ui/UiDate2';
import moment from 'moment';
import UiCheckbox from '@/components/ui/Checkbox';
import FormReport from '@/views/GetParc/ActLines/ActCreation/forms/parts/FormReport';

import { mapMutations } from 'vuex';

export default {
  props: {
    validateFn: Function,
    warningMsg: String,
  },
  components: {
    BaseDetailPanelContent,
    UiDate,
    UiCheckbox,
    FormReport,
  },
  mounted() {
    this.actDate = moment().format('DD/MM/YYYY');
  },
  data() {
    return {
      waitForReportConfirmation: false,
      isLoading: false,
      actDate: undefined,
      notificationCheck: undefined,
      report: undefined,
    };
  },

  methods: {
    ...mapMutations(['confirmAction', 'closePanel', 'flashMessage']),

    askForConfirmation() {
      this.confirmAction({
        message: this.warningMsg,
        actionFn: this.doAction,
      });
    },

    async doAction() {
      const response = await this.validateFn({
        actDate: this.actDate,
        notificationCheck: this.notificationCheck,
      });
      this.report = response.data.changeICCID;

      if (!response) {
        this.flashMessage({ level: 'danger', message: 'Erreur inconnue' });
      }

      if (response) {
        if (response.errors) {
          response.errors.forEach(e => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          if (this.report.successful) {
            this.closePanel();
            const successMessage = this.successMessage
              ? this.$t(this.successMessage)
              : 'Opération effectuée avec succès';
            this.flashMessage({ level: 'success', message: successMessage });
          }
        }
      }

      if (this.report.successful) {
        this.closePanel();
      }
    },
    onActDateChange(value) {
      this.actDate = value;
    },
  },
};
</script>

<style lang="scss" scoped></style>
