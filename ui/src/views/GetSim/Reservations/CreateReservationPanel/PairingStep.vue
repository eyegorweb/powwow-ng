<template>
  <CreateOrderStepContainer wide @done="done" @prev="prev" :can-go-to-next-step="!!canGoToNextStep">
    <div>
      <h3 class="font-weight-light text-center mt-4 mb-4">
        {{ $t('getsim.reservations.creation.upload') }}
      </h3>

      <DropZone v-model="selectedFile" class="dropZone" />

      <div v-if="requestErrors">
        <ul class="file-errors text-danger list-unstyled">
          <li :key="error" v-for="error in requestErrors">{{ error }}</li>
        </ul>
      </div>

      <div class="d-flex mt-4 justify-content-center">
        <span>{{ $t('getsim.reservations.creation.profileSelect') }}</span>
        <Toggle @update="toggleValue = $event.id" :values="toggleValues" class="pl-2" />
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

export default {
  components: {
    CreateOrderStepContainer,
    DropZone,
    Toggle,
  },
  data() {
    return {
      selectedFile: undefined,
      toggleValue: undefined,
      requestErrors: undefined,
      toggleValues: [
        {
          id: 'no',
          label: 'common.NO',
        },
        {
          id: 'active',
          label: 'filters.active',
        },
        {
          id: 'disabled',
          label: 'getreport.report_statut.DISABLED',
        },
      ],
    };
  },
  computed: {
    canGoToNextStep() {
      return true;
    },
  },
  watch: {
    selectedFile(newValue, oldValue) {
      this.requestErrors = undefined;

      if (newValue !== oldValue) {
        this.sendFile(newValue);
      }
    },
  },
  methods: {
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
      const requestErrors = this.validFile(file);
      if (requestErrors) {
        this.requestErrors = requestErrors;
      } else {
        const response = await uploadSearchFile(file, 'EID');

        if (response && response.errors) {
          this.requestErrors = response.errors.map((e) => e.message);
        }
      }
    },
    getSynthesis() {
      return {
        pairing: {},
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
