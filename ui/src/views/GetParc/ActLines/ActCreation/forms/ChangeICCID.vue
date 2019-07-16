<template>
  <ActWithFileUploadContainer
    :act-mutation-fn="changeICCID"
    act-code="ICCID"
    confirmation-message="getparc.actCreation.changeICCID.confirmationWarning"
  />
</template>

<script>
import ActWithFileUploadContainer from './parts/ActWithFileUploadContainer';
import { changeICCID } from '@/api/actCreation';

export default {
  components: {
    ActWithFileUploadContainer,
  },

  computed: {},
  methods: {
    async changeICCID(params) {
      return await changeICCID(params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
