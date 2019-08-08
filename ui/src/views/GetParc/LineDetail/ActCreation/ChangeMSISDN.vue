<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeMSISDN.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeMSISDN.currentMSISDN') }} :</h6>
      <p>{{ currentMSISDN }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeMSISDN.newMSISDN') }} :</h6>
      <p>
        <IdInput type="MSISDN" @invalidValue="onInvalidValue" @validValue="onValidValue" />
      </p>
    </div>
    <div slot="after" slot-scope="{ report }">
      <FormReport v-if="report" :data="report" />
    </div>
  </BaseForm>
</template>

<script>
import BaseForm from './BaseForm';
import { changeSingleMSISDN } from '@/api/actCreation';
import get from 'lodash.get';
import IdInput from '@/components/IdInput';
import FormReport from './FormReport';

export default {
  components: {
    IdInput,
    BaseForm,
    FormReport,
  },

  props: {
    lineData: Object,
  },

  data() {
    return {
      newMSISDN: undefined,
      canSend: false,
    };
  },

  methods: {
    onValidValue(value) {
      this.newMSISDN = value;
      this.canSend = true;
    },
    onInvalidValue() {
      this.newMSISDN = undefined;
      this.canSend = false;
    },
    async doRequest(context) {
      const { notificationCheck, actDate } = context;
      const params = {
        notifEmail: notificationCheck,
        dueDate: actDate,
        partyId: this.lineData.party.id,
        msisdn: this.currentMSISDN,
        newMsisdn: this.newMSISDN,
      };
      const response = await changeSingleMSISDN(params);
      if (response) {
        return { report: { ...response.data.changeMSISDN }, errors: response.errors };
      }
    },
  },

  computed: {
    currentMSISDN() {
      return get(this.lineData, 'accessPoint.lines[0].msisdn');
    },
  },
};
</script>

<style lang="scss" scoped></style>
