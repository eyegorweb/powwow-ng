<template>
  <ActWithFileUploadContainer
    :act-mutation-fn="changeMSISDN"
    act-code="CHANGE_MSISDN"
    confirmation-message="getparc.actCreation.changeMSISDN.confirmationWarning"
  />
</template>

<script>
import ActWithFileUploadContainer from './parts/ActWithFileUploadContainer';
import { changeMSISDN } from '@/api/actCreation';

export default {
  components: {
    ActWithFileUploadContainer,
  },
  methods: {
    async changeMSISDN(params) {
      return await changeMSISDN(params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
