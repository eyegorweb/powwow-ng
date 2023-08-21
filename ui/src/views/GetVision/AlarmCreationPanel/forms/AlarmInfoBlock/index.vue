<template>
  <div>
    <h5 class="text-primary text-uppercase">
      <span class="badge badge-pill badge-primary">{{ numNotif || num }}</span>
      <span class="title">{{ $t('getvsion.alarm-creation.chooseNotification') }}</span>
    </h5>

    <div class="row">
      <div class="col">
        <div class="d-flex mb-1 mt-3">
          <UiCheckbox v-model="sholdNotify" />
          <span>{{ $t('mailNotification') }}</span>
        </div>
        <div class="d-flex" v-if="wsNotifyOption !== 'NONE' && !noWsnotification">
          <UiCheckbox v-model="webserviceNotification" />
          <span>{{ $t('webserviceNotification') }}</span>
        </div>
      </div>
      <div class="col" v-if="sholdNotify">
        <h5>{{ $t('getvsion.mailing-list') }}</h5>
        <UiSelect v-model="notifList" :options="mailingLists" block />
      </div>
    </div>

    <div class="row">
      <div v-if="filteredAlarmType" class="col to-bottom">
        <div class="d-flex" v-if="isSuspensionAutoEnabled">
          <div class="d-flex flex-grow-1 mt-1">
            <UiCheckbox v-model="enableSuspension" :checked="false" />
            <span>{{ $t('getvsion.alarm.sus_auto') }}</span>
          </div>
          <div class="d-flex flex-grow-1 mt-1">
            <UiCheckbox
              v-model="enableReactivation"
              :checked="false"
              :disabled="!enableSuspension"
            />
            <span>{{ $t('getvsion.alarm.rea_auto') }}</span>
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="row">
      <div class="col to-bottom">
        <h5>{{ $t('getparc.lineDetail.alarms.name') }}</h5>
        <UiInput class="alarm-name d-block" v-model="alarmName" />
      </div>
      <div class="col">
        <div class="d-flex mb-3 mt-1">
          <UiCheckbox v-model="enableAlarm" />
          <span>{{ $t('getvsion.alarm.enableAlarm') }}</span>
        </div>
        <template v-if="editMode">
          <UiButton
            variant="primary"
            class="p-3"
            block
            @click="waitForConfirmation = true"
            :disabled="!canSaveAlarm || isLoading"
          >
            <span class="btn-label" v-if="!isLoading">{{ $t('getvsion.alarm.saveAlarm') }}</span>
            <span class="btn-label" v-else>{{ $t('getvsion.alarm.isLoading') }}</span>
          </UiButton>
        </template>
        <template v-else>
          <UiButton
            variant="primary"
            class="p-3"
            block
            @click="saveAlarm"
            :disabled="!canSaveAlarm || isLoading"
          >
            <span class="btn-label" v-if="!isLoading">{{ $t('getvsion.alarm.saveAlarm') }}</span>
            <span class="btn-label" v-else>{{ $t('getvsion.alarm.isLoading') }}</span>
          </UiButton>
        </template>
        <Modal v-if="waitForConfirmation">
          <div slot="body">
            <LoaderContainer :is-loading="isLoading">
              <div slot="on-loading">
                <ModalSkeleton :is-loading="isLoading" />
              </div>
              <div class="text-warning">
                {{ $t('getparc.actCreation.carouselItem.MODAL_WARNING') }}
              </div>
              <p>
                <span>{{
                  $t('alarms.warnings.OVER_CONSUMPTION_VOLUME_FLOTTE.modal.modalPreventMsg')
                }}</span>
                <br />
                <span>{{
                  $t('alarms.warnings.OVER_CONSUMPTION_VOLUME_FLOTTE.modal.modalConfirmMsg')
                }}</span>
              </p>
            </LoaderContainer>
          </div>
          <div slot="footer" class="btn-wrapper">
            <div v-if="haveError" class="loader" :class="{ error: haveError }">
              {{ $t('retry') }}
            </div>
            <button
              class="modal-default-button btn btn--cancel"
              @click.stop="waitForConfirmation = false"
              :disabled="isLoading"
            >
              {{ $t('cancel') }}
            </button>
            <button
              class="modal-default-button btn ml-1 btn--confirm"
              @click.stop="saveAlarm()"
              :disabled="isLoading"
            >
              {{ $t('confirm') }}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  </div>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';
import UiSelect from '@/components/ui/UiSelect';
import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/Button';
import Modal from '@/components/Modal';
import LoaderContainer from '@/components/LoaderContainer';
import ModalSkeleton from '@/components/ui/skeletons/ModalSkeleton';
import get from 'lodash.get';
import { getPartyOptions, isFeatureAvailable } from '@/api/partners.js';

export default {
  components: {
    UiCheckbox,
    UiSelect,
    UiInput,
    UiButton,
    Modal,
    LoaderContainer,
    ModalSkeleton,
  },
  props: {
    partner: Object,
    duplicateFrom: Object,
    alarm: Object,
    noWsnotification: Boolean,
    canSave: Boolean,
    isLoading: Boolean,
    numNotif: Number,
    suspension: {
      type: Boolean,
      default: false,
    },
    num: {
      type: Number,
      default: 3,
    },
    editMode: Boolean,
  },
  async mounted() {
    if (this.duplicateFrom) {
      this.notifList = this.duplicateFrom.mailingList
        ? this.duplicateFrom.mailingList.id
        : undefined;
      this.sholdNotify = this.duplicateFrom.notifyByEmail;
      this.webserviceNotification = this.duplicateFrom.notifyByWs;
      this.enableAlarm = !this.duplicateFrom.disabled;
      this.alarmName = this.duplicateFrom.name;
      this.enableSuspension = this.duplicateFrom.suspensionAuto;
      this.enableReactivation = this.duplicateFrom.reactivationAuto;
    }
    if (this.partner) {
      this.suspensionAuto = await isFeatureAvailable('SUSPENSION_AUTO', null, this.partner.id);
    }
  },
  computed: {
    filteredAlarmType() {
      return (
        this.alarm &&
        !['OVER_CONSUMPTION_VOLUME_FLOTTE', 'NOSESSION', 'ATYPICAL_ACTIVITY'].filter(
          (alarmId) => alarmId === this.alarm.id
        ).length
      );
    },
    wsNotifyOption() {
      let notificationOption = this.$loGet(
        this.partnerOptions,
        'wsNotificationParam.notificationOption'
      );
      if (!notificationOption) {
        notificationOption = 'NONE';
      }
      return notificationOption;
    },
    mailingLists() {
      if (!this.partner) return [];
      const mailingLists = get(this.partner, 'data.mailingLists', []);
      return mailingLists.map((m) => ({ label: m.name, value: m.id }));
    },
    canSaveAlarm() {
      let notifCondition = true;
      if (this.sholdNotify) {
        notifCondition = !!this.notifList;
      }

      return notifCondition && this.alarmName && this.canSave;
    },
    isSuspensionAutoEnabled() {
      return this.suspensionAuto && this.alarm.id === 'OVER_CONSUMPTION_VOLUME';
    },
  },
  watch: {
    async partner(newPartner) {
      this.partnerOptions = undefined;
      if (newPartner) {
        this.partnerOptions = await getPartyOptions(newPartner.id);
        this.suspensionAuto = await isFeatureAvailable('SUSPENSION_AUTO', null, this.partner.id);
      }
    },
  },
  methods: {
    saveAlarm() {
      this.$emit('save', {
        alarmName: this.alarmName,
        enableAlarm: this.enableAlarm,
        notifList: this.notifList,
        sholdNotify: this.sholdNotify,
        webserviceNotification: this.webserviceNotification,
        enableSuspension: this.enableSuspension,
        enableReactivation: this.enableReactivation,
        partner: this.partner,
      });
    },
  },

  data() {
    return {
      sholdNotify: false,
      webserviceNotification: false,
      alarmName: undefined,
      enableAlarm: true,
      enableSuspension: false,
      enableReactivation: false,
      notifList: undefined,
      partnerOptions: undefined,
      waitForConfirmation: false,
      haveError: false,
      suspensionAuto: undefined,
    };
  },
};
</script>

<style lang="scss" scoped>
h5 {
  font-weight: 700;

  .title {
    position: relative;
    top: 3px;
    padding-left: 5px;
  }
}

.to-bottom {
  align-self: flex-end;
}

.form-container {
  display: flex;
  flex-flow: row wrap;
  align-items: center;

  ::v-deep .checkbox-container label {
    margin-bottom: 0;
    margin-left: 20px;
  }
}

.btn {
  background-color: $orange;
  color: white;

  &.disabled {
    opacity: 1;
    pointer-events: none;
    background-color: $medium-gray;
  }
}

.info {
  color: $orange;
}

.btn-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .btn {
    width: calc(50% - 15px);
    border: 1px solid $primary;

    &--cancel {
      background-color: $white;
      color: $primary;
    }

    &--confirm {
      background-color: $primary;
      color: $white;
    }
  }
}
</style>
