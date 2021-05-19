<template>
  <div class="col-md-9 extra-bottom-margin">
    <Title
      num="1"
      title="getparc.actLines.step1File"
      :color="actToCreate.color"
      :uppercase="true"
    />
    <DropZone v-model="selectedFile" class="dropZone" />

    <div class="mt-5">
      <ActFormContainer :validate-fn="onValidate" />
    </div>
  </div>
</template>

<script>
import ActFormContainer from '@/views/GetParc/ActLines/ActCreation/forms/parts/ActFormContainer2.vue';
import Title from '@/views/GetParc/ActLines/Title.vue';
import DropZone from '@/components/ui/DropZone';
import { uploadSearchFile } from '@/api/linesActions';
import { pairingByImportedFile } from '@/api/esim.js';

export default {
  components: {
    Title,
    DropZone,
    ActFormContainer,
  },
  props: {
    actToCreate: Object,
    actCreationPrerequisites: Object,
    appliedFilters: Array,
  },
  data() {
    return {
      selectedFile: undefined,
      searchFileResponse: undefined,
    };
  },
  methods: {
    async doSendPairingRequest(params) {
      const partnerId = this.$loGet(this.actCreationPrerequisites, 'partner.id');
      const tempEidUuid = params.tempDataUuid;
      return pairingByImportedFile({ partnerId, tempEidUuid });
    },
    async onValidate(contextValues) {
      if (!contextValues.tempDataUuid) {
        if (this.selectedFile) {
          this.searchFileResponse = await uploadSearchFile(this.selectedFile, 'EID');
          if (this.searchFileResponse.errors && this.searchFileResponse.errors.length) {
            return this.searchFileResponse;
          }

          return this.doSendPairingRequest({
            tempDataUuid: this.searchFileResponse.tempDataUuid,
          });
        }
      } else {
        return this.doSendPairingRequest({
          tempDataUuid: contextValues.tempDataUuid,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
