<template>
  <div>
    <BaseDetailPanelContent v-if="!addCustomField" white>
      <div class="m-3">
        <div class="entries-line">
          <div class="form-entry">
            <template v-if="customFields.length > 0">
              <CustomFields
                :direction="direction"
                :custom-fields="customFields"
                :get-selected-value="getSelectedValue"
                :errors="errors"
                :can-edit-list="canEditList"
                :show-optional-field="showOptionalField"
                @change="onValueChanged"
              />
            </template>
          </div>
        </div>
      </div>
      <div v-if="!addCustomField" slot="footer" class="action-buttons">
        <AddCustomFieldActions
          @cancel="closePanel"
          @add-field="save"
          :can-send="canSend"
          :text="actionLabel"
        />
      </div>
    </BaseDetailPanelContent>
    <template v-if="addCustomField">
      <AddCustomField
        :panel="panel"
        :label-title="label"
        fixheight
        :close="closePanel"
        @add-field="save"
        :number-of-custom-fields="content.currentNbCF"
      />
    </template>
  </div>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import CustomFields from '@/components/CustomFields';
import AddCustomField from '@/views/GetSim/CreateOrder/StepSettings/AddCustomField';
import AddCustomFieldActions from '@/views/GetSim/CreateOrder/StepSettings/AddCustomFieldActions';
import { mapGetters, mapMutations } from 'vuex';
import { updateCustomFields } from '@/api/actCreation';
import { createCustomField } from '@/api/customFields';
import { formattedCurrentDate } from '@/utils/date';

export default {
  components: {
    BaseDetailPanelContent,
    CustomFields,
    AddCustomField,
    AddCustomFieldActions,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      customFields: [],
      specificFields: [],
      customFieldsValues: [],
      errors: [],
      canEditList: true,
      showOptionalField: true,
      partnerId: undefined,
      canSend: false,
      addCustomField: false,
      panel: 'admin',
      label: 'libre',
      direction: 'down',
    };
  },

  mounted() {
    this.partnerId = this.content.partnerId;
    if (this.content && this.content.modifyCustomField) {
      this.customFields.push(this.content.modifyCustomField);
    } else {
      this.addCustomField = true;
    }
  },

  computed: {
    ...mapGetters(['userIsPartner']),
    actionLabel() {
      return this.label ? this.$t('orders.modify-custom-field-action', { label: this.label }) : '';
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),
    getSelectedValue(code) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.customFieldsValues.find(c => c.code === customField.code);
      if (enteredValue) this.canSend = true;
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
    async save(fieldData) {
      const getCustomFieldValue = code => {
        const found = this.customFieldsValues.filter(c => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };
      const params = {
        partyId: this.partnerId,
        dueDate: formattedCurrentDate(),
        tempDataUuid: undefined,
        custom1: getCustomFieldValue('custom1'),
        custom2: getCustomFieldValue('custom2'),
        custom3: getCustomFieldValue('custom3'),
        custom4: getCustomFieldValue('custom4'),
        custom5: getCustomFieldValue('custom5'),
        custom6: getCustomFieldValue('custom6'),
        spec1: getCustomFieldValue('spec1'),
        spec2: getCustomFieldValue('spec2'),
      };

      let response;

      if (this.content.modifyCustomField) {
        response = await updateCustomFields([], [], params);
      } else {
        response = await createCustomField({
          partyId: this.partnerId,
          label: fieldData.label,
          type: fieldData.type,
          values: fieldData.values,
          mandatoryVal: fieldData.mandatoryVal,
          isSpec: false,
        });
      }

      if (!response && response.errors && response.errors.length) {
        this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
};
</script>

<style lang="scss" scoped></style>
