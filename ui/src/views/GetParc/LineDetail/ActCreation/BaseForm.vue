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
            :min-date="minDate"
            class="d-block large-date-picker"
            direction="down"
            :disabled="disabledDate"
            fixed
            large
            time-picker
          ></UiDate>
        </div>
        <div class="col">
          <button
            @click="askForConfirmation()"
            class="btn btn-primary pl-4 pr-4 pt-2 pb-2 mt-4"
            :disabled="!canSend"
          >
            <em slot="icon" class="pr-2 select-icon ic-Floppy-Icon" />

            <span>{{ $t('set') }}</span>
          </button>
        </div>
      </div>
      <slot name="after" :report="report"></slot>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import UiDate from '@/components/ui/UiDate';
import moment from 'moment';
import UiCheckbox from '@/components/ui/Checkbox';

import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    validateFn: Function,
    warningMsg: String,
    canSend: Boolean,
    changeOffer: Boolean,
  },
  components: {
    BaseDetailPanelContent,
    UiDate,
    UiCheckbox,
  },
  mounted() {
    if (this.changeOffer && this.userIsBO && !this.userIsMVNO) {
      this.actDate = moment().endOf('month').format('DD/MM/YYYY HH:mm:ss');
    } else if (this.changeOffer && !this.userIsBO && !this.userIsMVNO) {
      this.actDate = moment().endOf('month').format('DD/MM/YYYY HH:mm:ss');
      this.disabledDate = true;
    } else {
      this.actDate = moment().format('DD/MM/YYYY HH:mm:ss');
    }
  },
  data() {
    return {
      waitForReportConfirmation: false,
      isLoading: false,
      actDate: undefined,
      notificationCheck: undefined,
      report: undefined,
      disabledDate: false,
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

      if (!response) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        return;
      }

      this.report = response.report;

      if (response) {
        if (response.errors && response.errors.length) {
          response.errors.forEach((e) => {
            this.flashMessage({ level: 'danger', message: e.message });
          });
        } else {
          if (this.report.validated) {
            this.closePanel();
            const successMessage = this.successMessage
              ? this.$t(this.successMessage)
              : this.$t('genericSuccessMessage');
            this.flashMessage({ level: 'success', message: successMessage });
          }
        }
      }

      if (this.report && this.report.successful) {
        this.closePanel();
      }
    },
    onActDateChange(value) {
      this.actDate = value;
    },
  },
  computed: {
    ...mapGetters(['userIsMVNO', 'userIsBO']),
    minDate() {
      return moment().format('DD/MM/YYYY HH:mm:ss');
    },
  },
};
</script>

<style lang="scss" scoped></style>
