<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeMSISDN.confirmationWarning"
    :validate-fn="doRequest"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeMSISDN.currentMSISDN') }} :</h6>
      <p>{{ currentMSISDN }}</p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeMSISDN.newMSISDN') }} :</h6>
      <p>
        <UiInput v-model="newMSISDN" class="d-block" />
      </p>
    </div>
  </BaseForm>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import BaseForm from './BaseForm';
import { changeSingleMSISDN } from '@/api/actCreation';
import get from 'lodash.get';

export default {
  components: {
    UiInput,
    BaseForm,
  },

  props: {
    lineData: Object,
  },

  data() {
    return {
      newMSISDN: undefined,
    };
  },

  methods: {
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
