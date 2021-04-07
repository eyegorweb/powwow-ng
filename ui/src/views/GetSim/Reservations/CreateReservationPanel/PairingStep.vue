<template>
  <CreateOrderStepContainer wide @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div>
      <h3 class="font-weight-light text-center mt-4 mb-4">
        {{ $t('getsim.reservations.creation.upload') }}
      </h3>

      <DropZone v-model="selectedFile" class="dropZone" />

      <div class="d-flex justify-content-between" v-if="requestErrors">
        <ul class="file-errors text-danger list-unstyled">
          <li :key="error" v-for="error in requestErrors">{{ error }}</li>
        </ul>
        <div>
          <UiButton variant="link" size="sm" @click="cancelLastUpload">
            {{ $t('cancel') }}
          </UiButton>
        </div>
      </div>

      <div class="d-flex mt-4 justify-content-center">
        <span>{{ $t('getsim.reservations.creation.profileSelect') }}</span>
        <Toggle
          @update="toggleValue = $event"
          :values="toggleValues"
          :disabled="!isUploadValid || !serviceActivationAsked"
          class="pl-2"
        />
      </div>
    </div>
  </CreateOrderStepContainer>
</template>

<script>
import CreateOrderStepContainer from '@/views/GetSim/CreateOrder/CreateOrderStepContainer.vue';
import DropZone from '@/components/ui/DropZone';
import Toggle from '@/components/ui/UiToggle2';
import { uploadSearchFile } from '@/api/linesActions.js';
import * as fileUtils from '@/utils/file.js';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    CreateOrderStepContainer,
    DropZone,
    Toggle,
    UiButton,
  },
  props: {
    synthesis: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedFile: undefined,
      toggleValue: undefined,
      requestErrors: undefined,
      validatedInUploadedFile: undefined,
      lastResponse: undefined,
      toggleValues: [
        {
          id: 'NO',
          label: 'common.NO',
          default: true,
        },
        {
          id: 'ENABLED',
          label: 'filters.active',
        },
        {
          id: 'DISABLED',
          label: 'getreport.report_statut.DISABLED',
        },
      ],
    };
  },
  computed: {
    canGoToNextStep() {
      const quantity = parseInt(this.$loGet(this.synthesis, 'stepProduct.quantity'));
      if (this.lastResponse) {
        return quantity === this.validatedInUploadedFile;
      }
      return true;
    },
    isUploadValid() {
      const quantity = parseInt(this.$loGet(this.synthesis, 'stepProduct.quantity'));
      if (this.lastResponse) {
        return quantity === this.validatedInUploadedFile;
      }
      return false;
    },
    serviceActivationAsked() {
      return !!this.$loGet(this.synthesis, 'serviceStep.activation');
    },
  },
  mounted() {
    this.cancelLastUpload();
  },
  watch: {
    selectedFile(newValue, oldValue) {
      this.requestErrors = undefined;

      if (newValue && newValue !== oldValue) {
        this.sendFile(newValue);
      }
    },
  },
  methods: {
    cancelLastUpload() {
      this.validatedInUploadedFile = undefined;
      this.lastResponse = undefined;
      this.selectedFile = undefined;
    },
    validFile(file) {
      let requestErrors = undefined;

      if (fileUtils.checkFormat(file)) {
        requestErrors = [this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT')];
      } else if (fileUtils.checkFileSize(file)) {
        requestErrors = [this.$t('getparc.actCreation.report.FILE_SIZE_LIMIT_EXCEEDED')];
      } else if (file.error) {
        requestErrors = [this.$t('getparc.actCreation.report.' + file.error)];
      }
      return requestErrors;
    },
    async sendFile(file) {
      this.validatedInUploadedFile = undefined;
      this.lastResponse = undefined;

      const requestErrors = this.validFile(file);
      if (requestErrors) {
        this.requestErrors = requestErrors;
      } else {
        const response = await uploadSearchFile(file, 'EID');
        this.lastResponse = response;

        this.validatedInUploadedFile = response.validated;

        if (response && response.errors) {
          this.requestErrors = response.errors.map(e => e.message);
        }
      }
    },
    getSynthesis() {
      return {
        pairingStep: {
          response: this.lastResponse,
          profile: this.toggleValue,
        },
      };
    },
    done() {
      if (this.canGoToNextStep) {
        this.$emit('done', this.getSynthesis());
      }
    },
    prev() {
      this.$emit('prev', this.getSynthesis());
    },
  },
};
</script>

<style lang="scss" scoped>
.file-errors {
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
