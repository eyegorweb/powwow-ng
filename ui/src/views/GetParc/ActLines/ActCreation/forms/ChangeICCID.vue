<template>
  <ActWithFileUploadContainer
    :act-mutation-fn="changeICCID"
    act-code="CHANGE_ICCID"
    always-show-report
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
