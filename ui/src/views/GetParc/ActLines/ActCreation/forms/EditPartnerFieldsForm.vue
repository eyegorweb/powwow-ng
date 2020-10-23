<template>
  <ActFormContainer :validate-fn="onValidate">
    <div>
      <PartnerFields
        :custom-fields="allCustomFields"
        :specific-fields="allSpecificFields"
        :get-selected-value="getSelectedValue"
        :errors="customFieldsErrors"
        @change="onValueChanged"
        show-optional-field
      />
    </div>
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button
        @click="waitForConfirmation = true"
        :disabled="!canValidate"
        class="btn btn-primary pl-4 pr-4 pt-2 pb-2"
      >
        <i class="ic-Edit-Icon" />
        {{ $t('getparc.actCreation.editCustomFields.validateBtn') }}
      </button>
      <Modal v-if="waitForConfirmation">
        <div slot="body">
          <div class="text-danger">
            <i class="ic-Alert-Icon"></i>
            {{ $t('getparc.actCreation.editCustomFields.confirmationWarning') }}
          </div>
        </div>
        <div slot="footer">
          <button
            class="modal-default-button btn btn-danger btn-sm"
            @click.stop="waitForConfirmation = false"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="modal-default-button btn btn-success btn-sm ml-1"
            @click.stop="confirmValdation(containerValidationFn)"
          >
            {{ $t('save') }}
          </button>
        </div>
      </Modal>
    </div>
    <div slot="messages" class="text-info">
      <span>
        <i class="ic-Alert-Icon" />
        <template v-if="allFields && allFields.length">{{
          $t('getparc.actCreation.editCustomFields.infoMessage')
        }}</template>
        <template v-else>{{ $t('getparc.actCreation.editCustomFields.noResult') }}</template>
      </span>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import PartnerFields from '@/components/PartnerFields';
import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { updateCustomFields } from '@/api/actCreation';
import Modal from '@/components/Modal';
import { searchLineById } from '@/api/linesActions';

export default {
  components: {
    ActFormContainer,
    PartnerFields,
    Modal,
  },
  data() {
    return {
      allCustomFields: [],
      allSpecificFields: [],
      allFields: [],
      allFieldsValues: [],
      customFieldsErrors: undefined,
      waitForConfirmation: false,
      canSend: false,
      singleLineFound: undefined,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    partner() {
      if (this.actCreationPrerequisites.searchById) {
        if (this.singleLineFound) {
          return this.singleLineFound.party;
        }
      }
      return this.actCreationPrerequisites.partner;
    },
    canValidate() {
      if (this.allFields && this.allFields.length && this.canSend) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    await this.loadSingleLineInfo();
    if (!this.partner) return;
    this.fetchCustomFieldsForPartner();
  },
  methods: {
    async loadSingleLineInfo() {
      if (
        this.actCreationPrerequisites.searchById &&
        this.linesActionsResponse &&
        this.linesActionsResponse.total === 1
      ) {
        const lineInTable = this.linesActionsResponse.items[0];
        this.singleLineFound = await searchLineById(lineInTable.id);
      }
    },
    async fetchCustomFieldsForPartner() {
      const partnerId = this.partner.id;
      const customFields = await fetchCustomFields(partnerId);
      this.allCustomFields = customFields.customFields.map(c => {
        if (c.mandatory === 'NONE') {
          c.isOptional = true;
        } else {
          c.isOptional = false;
        }
        return c;
      });
      this.allSpecificFields = customFields.specificFields;
      this.allFields = customFields.customFields.concat(customFields.specificFields);
    },

    getSelectedValue(code) {
      const existingFieldValue = this.allFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.allFieldsValues.find(c => c.code === customField.code);
      if (enteredValue) {
        this.canSend = true;
      } else {
        this.canSend = false;
      }
      if (existingFieldValue) {
        this.allFieldsValues = this.allFieldsValues.map(c => {
          if (c.code === customField.code) {
            return {
              ...c,
              enteredValue,
            };
          }
          return c;
        });
      } else {
        customField.enteredValue = enteredValue;
        this.allFieldsValues = [...this.allFieldsValues, { ...customField }];
      }
    },
    async onValidate(contextValues) {
      const getCustomFieldValue = code => {
        const found = this.allFieldsValues.filter(c => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };
      const params = {
        partyId: this.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        custom1: getCustomFieldValue('custom1'),
        custom2: getCustomFieldValue('custom2'),
        custom3: getCustomFieldValue('custom3'),
        custom4: getCustomFieldValue('custom4'),
        custom5: getCustomFieldValue('custom5'),
        custom6: getCustomFieldValue('custom6'),
        spec1: getCustomFieldValue('spec1'),
        spec2: getCustomFieldValue('spec2'),
        tempDataUuid: contextValues.tempDataUuid,
      };
      return await updateCustomFields(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
      // if (!response.errors) {
      //   return response;
      // } else {
      //   const errors = response.errors;
      //   console.log('errors', errors);
      // }
    },
    async confirmValdation(containerValidationFn) {
      const response = await containerValidationFn();
      this.waitForConfirmation = false;
      return response;
    },
    chekcForErrors() {
      const getCustomFieldValue = code => {
        const found = this.allFieldsValues.filter(c => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };

      this.customFieldsErrors = this.allCustomFields
        .filter(c => c.mandatory !== 'NONE')
        .filter(c => {
          const value = getCustomFieldValue(c.code);
          if (!value || value.length === 0) {
            return true;
          }
        })
        .map(c => c.code);
    },
  },
};
</script>

<style lang="scss" scoped></style>
