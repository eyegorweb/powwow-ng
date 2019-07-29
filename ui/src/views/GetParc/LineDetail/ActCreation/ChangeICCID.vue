<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeICCID.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeICCID.currentICCID') }} :</h6>
      <p>{{ lineData.iccid }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeICCID.newICCID') }} :</h6>
      <p>
        <IdInput type="ICCID" @invalidValue="onValidValue" @validValue="onInvalidValue" />
      </p>
    </div>
  </BaseForm>
</template>

<script>
import BaseForm from './BaseForm';
import { changeSingleICCID } from '@/api/actCreation';
import IdInput from '@/components/IdInput';

export default {
  components: {
    BaseForm,
    IdInput,
  },

  props: {
    lineData: Object,
  },

  data() {
    return {
      newICCID: undefined,
      canSend: false,
    };
  },

  methods: {
    onValidValue(value) {
      this.newICCID = value;
      this.canSend = false;
    },
    onInvalidValue() {
      this.newICCID = undefined;
      this.canSend = true;
    },
    async doRequest(context) {
      const { notificationCheck, actDate } = context;
      const params = {
        notifEmail: notificationCheck,
        dueDate: actDate,
        partyId: this.lineData.party.id,
        iccid: this.lineData.iccid,
        newIccid: this.newICCID,
      };
      const response = await changeSingleICCID(params);

      if (response) {
        return { report: { ...response.data.changeICCID }, errors: response.errors };
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
