<template>
  <ActFormContainer :validate-fn="onValidate">
    <div>
      <CustomFields
        :fields="allCustomFields"
        :get-selected-value="getSelectedValue"
        :errors="customFieldsErrors"
        @change="onValueChanged"
      />
    </div>
    <div slot="validate-btn-content" slot-scope="{ containerValidationFn }">
      <button @click="waitForConfirmation = true" class="btn btn-primary pl-4 pr-4 pt-2 pb-2">
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
        {{ $t('getparc.actCreation.editCustomFields.infoMessage') }}
      </span>
    </div>
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer2';
import CustomFields from '@/components/CustomFields';
import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { updateCustomFields } from '@/api/actCreation2';
import Modal from '@/components/Modal';

export default {
  components: {
    ActFormContainer,
    CustomFields,
    Modal,
  },
  data() {
    return {
      allCustomFields: [],
      customFieldsValues: [],
      customFieldsErrors: [],
      waitForConfirmation: false,
    };
  },
  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
  },
  mounted() {
    this.fetchCustomFieldsForPartner();
  },
  methods: {
    async fetchCustomFieldsForPartner() {
      const partnerId = this.actCreationPrerequisites.partner.id;
      this.allCustomFields = await fetchCustomFields(partnerId);
    },

    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === customField.code);
      if (existingFieldValue) {
        this.customFieldsValues = this.customFieldsValues.map(c => {
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
        this.customFieldsValues = [...this.customFieldsValues, { ...customField }];
      }
    },
    async onValidate(contextValues) {
      const getCustomFieldValue = code => {
        const found = this.customFieldsValues.filter(c => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };
      const params = {
        partyId: this.actCreationPrerequisites.partner.id,
        dueDate: contextValues.actDate,
        notifEmail: contextValues.notificationCheck,
        custom1: getCustomFieldValue('custom1'),
        custom2: getCustomFieldValue('custom2'),
        custom3: getCustomFieldValue('custom3'),
        custom4: getCustomFieldValue('custom4'),
        custom5: getCustomFieldValue('custom5'),
        custom6: getCustomFieldValue('custom6'),
        tempDataUuid: contextValues.tempDataUuid,
      };
      return await updateCustomFields(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
    },
    async confirmValdation(containerValidationFn) {
      const response = await containerValidationFn();
      this.waitForConfirmation = false;
      return response;
    },
  },
};
</script>

<style lang="scss" scoped></style>
