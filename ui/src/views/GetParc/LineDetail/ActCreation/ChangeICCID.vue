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
        <IdInput type="ICCID" @invalidValue="onInvalidValue" @validValue="onValidValue" />
      </p>
    </div>
    <div slot="after" slot-scope="{ report }">
      <FormReport v-if="report" :data="report" />
    </div>
  </BaseForm>
</template>

<script>
import BaseForm from './BaseForm';
import { changeSingleICCID } from '@/api/actCreation';
import IdInput from '@/components/IdInput';
import FormReport from './FormReport';

export default {
  components: {
    BaseForm,
    IdInput,
    FormReport,
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
      this.canSend = true;
    },
    onInvalidValue() {
      this.newICCID = undefined;
      this.canSend = false;
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
