<template>
  <CreateOrderStepContainer wide @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div>
      <h3 class="font-weight-light text-center mt-4 mb-4">
        {{ $t('getsim.reservations.creation.upload') }}
      </h3>
      <div class="position-relative">
        <DropZone v-model="selectedFile" class="dropZone" />
      </div>

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
          v-if="toggleValues"
          @update="toggleValue = $event"
          :values="toggleValues"
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
          value: 'NO',
          label: 'common.NO',
          default: true,
        },
        {
          id: 'ENABLED',
          value: 'ENABLED',
          label: 'filters.active',
          disabled: true,
        },
        {
          id: 'DISABLED',
          value: 'DISABLED',
          label: 'getreport.report_statut.DISABLED',
          disabled: true,
        },
      ],
      isUploadValid: false,
    };
  },
  computed: {
    canGoToNextStep() {
      const quantity = parseInt(this.$loGet(this.synthesis, 'stepProduct.quantity'));
      if (this.lastResponse) {
        return (
          quantity === this.lastResponse.validated &&
          (!this.requestErrors || (this.requestErrors && !this.requestErrors.length))
        );
      }
      return !this.requestErrors || (this.requestErrors && !this.requestErrors.length);
    },
    serviceActivationAsked() {
      return !!this.$loGet(this.synthesis, 'serviceStep.activation');
    },
  },
  watch: {
    async selectedFile(newValue, oldValue) {
      this.requestErrors = undefined;

      if (newValue && newValue !== oldValue) {
        await this.sendFile(newValue);

        let newToggleValues = this.toggleValues.map((t) => {
          if (t.value !== 'NO') {
            t.disabled = !this.isUploadValid || !this.serviceActivationAsked;
          } else {
            t.default = true;
          }
          return t;
        });
        this.toggleValues = undefined;
        this.$nextTick(() => {
          this.toggleValues = newToggleValues;
        });
        const quantity = parseInt(this.$loGet(this.synthesis, 'stepProduct.quantity'));
        if (this.validatedInUploadedFile && quantity !== this.validatedInUploadedFile) {
          this.requestErrors = [this.$t('getsim.reservations.creation.errors.numberOfLines')];
        }
      }
    },
  },
  methods: {
    cancelLastUpload() {
      this.validatedInUploadedFile = undefined;
      this.lastResponse = undefined;
      this.selectedFile = undefined;
      this.isUploadValid = false;
      let newToggleValues = [
        {
          id: 'NO',
          value: 'NO',
          label: 'common.NO',
          default: true,
        },
        {
          id: 'ENABLED',
          value: 'ENABLED',
          label: 'filters.active',
          disabled: true,
        },
        {
          id: 'DISABLED',
          value: 'DISABLED',
          label: 'getreport.report_statut.DISABLED',
          disabled: true,
        },
      ];
      this.toggleValues = undefined;
      this.$nextTick(() => {
        this.toggleValues = newToggleValues;
      });
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
      this.isUploadValid = false;

      const requestErrors = this.validFile(file);
      if (requestErrors) {
        this.requestErrors = requestErrors;
      } else {
        const response = await uploadSearchFile(file, 'EID');
        this.lastResponse = response;

        this.validatedInUploadedFile = response.validated;

        const quantity = parseInt(this.$loGet(this.synthesis, 'stepProduct.quantity'));
        this.isUploadValid =
          quantity === this.lastResponse.validated &&
          (!this.requestErrors || (this.requestErrors && !this.requestErrors.length));

        if (response && response.errors) {
          this.requestErrors = response.errors.map((e) => e.message);
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
