<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeICCID.confirmationWarning"
    :validate-fn="doRequest"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeICCID.currentICCID') }} :</h6>
      <p>
        <UiInput v-model="currentICCID" class="d-block" />
      </p>
    </div>
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.changeICCID.newICCID') }} :</h6>
      <p>
        <UiInput v-model="newICCID" class="d-block" />
      </p>
    </div>
  </BaseForm>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import BaseForm from './BaseForm';
import { changeSingleICCID } from '@/api/actCreation';

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
      currentICCID: undefined,
      newICCID: undefined,
    };
  },

  methods: {
    async doRequest(context) {
      const { notificationCheck, actDate } = context;
      const params = {
        notifEmail: notificationCheck,
        dueDate: actDate,
        partyId: this.lineData.party.id,
        iccid: this.currentICCID,
        newIccid: this.newICCID,
      };
      return await changeSingleICCID(params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
