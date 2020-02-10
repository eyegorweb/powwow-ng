<template>
  <ActFormContainer :validate-fn="doRequest">
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button
        :disabled="!canValidateRequest"
        @click="showValidationModal = true"
        class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
      >
        <i class="ic-Edit-Icon" />
        {{ $t('getparc.actCreation.changeService.validateBtn') }}
      </button>

      <Modal v-if="showValidationModal">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t(confirmationMessage) }}
          </div>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            v-if="!isLoading"
            @click.stop="showValidationModal = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            v-if="!isLoading"
            @click.stop="validateFile(containerValidationFn)"
          >
            {{ $t('save') }}
          </button>
          <button class="modal-default-button btn btn-light btn-sm ml-1" disabled v-if="isLoading">
            {{ $t('processing') }}
            <CircleLoader />
          </button>
        </div>
      </Modal>
    </div>
    <div slot="messages">
      <div v-if="requestErrors">
        <h6 class="text-danger">{{ $t('errors.all') }}</h6>
        <ul class="text-danger list-unstyled">
          <li :key="error.message" v-for="error in requestErrors">{{ error.message }}</li>
        </ul>
      </div>

      <FormReport v-if="report && haveBusinessErrors" :data="report" />
      <button
        v-if="tempDataUuid"
        @click="confirmRequest(true)"
        class="btn btn-success pl-4 pr-4 pt-2 pb-2"
      >
        <span>{{ $t('confirm') }}</span>
      </button>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './ActFormContainer';
import { uploadSearchFile } from '@/api/linesActions';
import { mapState, mapMutations } from 'vuex';
import FormReport from './FormReport';
import Modal from '@/components/Modal';
import CircleLoader from '@/components/ui/CircleLoader';

export default {
  components: {
    ActFormContainer,
    FormReport,
    Modal,
    CircleLoader,
  },
  props: {
    actMutationFn: Function,
    actCode: String,
    confirmationMessage: String,
    successMessage: String,
  },
  data() {
    return {
      tempDataUuid: undefined,
      requestError: undefined,
      requestErrors: undefined,
      contextValues: undefined,
      report: undefined,

      showValidationModal: false,
      isLoading: false,
    };
  },
  watch: {
    selectedFileForActCreation() {
      this.resetForm();
    },

    actCreationPrerequisites() {
      this.resetForm();
      this.setSelectedFileForActCreation(undefined);
    },
  },
  computed: {
    ...mapState('actLines', ['selectedFileForActCreation', 'actCreationPrerequisites']),
    canValidateRequest() {
      return this.selectedFileForActCreation && !this.tempDataUuid;
    },
    haveBusinessErrors() {
      if (!this.report) return 0;
      return this.report.errors.reduce((total, e) => {
        return (total += e.number);
      }, 0);
    },
  },
  methods: {
    ...mapMutations('actLines', [
      'setSelectedFileForActCreation',
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
    ]),
    ...mapMutations(['flashMessage']),

    resetForm() {
      this.tempDataUuid = undefined;
      this.requestErrors = undefined;
      this.report = undefined;
      this.contextValues = undefined;
    },
    async doRequest(contextValues) {
      const response = await uploadSearchFile(this.selectedFileForActCreation, this.actCode);
      if (!response.error) {
        this.tempDataUuid = response.tempDataUuid;
        this.contextValues = contextValues;
      } else {
        if (response.error.includes('400')) {
          this.requestErrors = [
            {
              message: this.$t('getparc.actCreation.report.DATA_INVALID_FORMAT'),
            },
          ];
        } else {
          this.requestErrors = [
            {
              message: response.error,
            },
          ];
        }
        return { stayInForm: true };
      }

      this.report = response;
      if (this.haveBusinessErrors) {
        return { stayInForm: true };
      } else {
        return await this.confirmRequest();
      }
    },

    async validateFile(containerValidationFn) {
      this.isLoading = true;
      await containerValidationFn();
      this.showValidationModal = false;
      this.isLoading = false;
    },

    async confirmRequest(showMessage = false) {
      const params = {
        notifEmail: this.contextValues.notificationCheck,
        dueDate: this.contextValues.actDate,
        partyId: this.actCreationPrerequisites.partner.id,

        tempDataUuid: this.tempDataUuid,
      };
      this.requestErrors = undefined;
      const response = await this.actMutationFn(params);
      if (response.errors) {
        this.requestErrors = response.errors;
      } else {
        if (showMessage) {
          const successMessage = this.successMessage
            ? this.$t(this.successMessage)
            : 'Opération effectuée avec succès';
          this.flashMessage({ level: 'success', message: successMessage });
        }
        // sortir du mode création acte
        this.setActToCreate(null);
        this.setActCreationPrerequisites(null);
        this.setSelectedLinesForActCreation([]);

        this.resetForm();
        this.setSelectedFileForActCreation(undefined);
      }

      return response;
    },
  },
};
</script>

<style lang="scss" scoped></style>
