<template>
  <div>
    <BaseDetailPanelContent v-if="!addSpecificField" white>
      <div class="m-3">
        <div class="entries-line">
          <div class="form-entry">
            <template v-if="specificFields.length > 0">
              <SpecificFields
                :direction="direction"
                :specific-fields="specificFields"
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
      <div v-if="!addSpecificField" slot="footer" class="action-buttons">
        <AddCustomFieldActions
          @cancel="closePanel"
          @add-field="save"
          :can-send="canSend"
          :text="actionLabel"
        />
      </div>
    </BaseDetailPanelContent>
    <template v-if="addSpecificField">
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
import SpecificFields from '@/components/SpecificFields';
import AddCustomField from '@/views/GetSim/CreateOrder/StepSettings/AddCustomField';
import AddCustomFieldActions from '@/views/GetSim/CreateOrder/StepSettings/AddCustomFieldActions';
import { mapMutations } from 'vuex';
import { updateCustomFields } from '@/api/actCreation';
import { createCustomField } from '@/api/customFields';
import { formattedCurrentDate } from '@/utils/date';

export default {
  components: {
    BaseDetailPanelContent,
    SpecificFields,
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
      specificFieldsValues: [],
      errors: [],
      canEditList: true,
      showOptionalField: true,
      partnerId: undefined,
      canSend: false,
      addSpecificField: false,
      panel: 'admin',
      label: 'spécifique',
      direction: 'down',
    };
  },

  mounted() {
    this.partnerId = this.content.partnerId;
    if (this.content && this.content.modifySpecificField) {
      this.specificFields.push(this.content.modifySpecificField);
    } else {
      this.addSpecificField = true;
    }
  },

  computed: {
    actionLabel() {
      return this.label ? this.$t('orders.modify-custom-field-action', { label: this.label }) : '';
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),
    getSelectedValue(code) {
      const existingFieldValue = this.specificFieldsValues.find(c => c.code === code);
      if (existingFieldValue) {
        return existingFieldValue.enteredValue;
      }
    },
    onValueChanged(customField, enteredValue) {
      const existingFieldValue = this.specificFieldsValues.find(c => c.code === customField.code);
      if (enteredValue) this.canSend = true;
      if (existingFieldValue) {
        this.specificFieldsValues = this.specificFieldsValues.map(c => {
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
        this.specificFieldsValues = [...this.specificFieldsValues, { ...customField }];
      }
    },
    async save(fieldData) {
      const getCustomFieldValue = code => {
        const found = this.specificFieldsValues.filter(c => c.code === code);
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

      if (this.content.modifySpecificField) {
        response = await updateCustomFields([], [], params);
      } else {
        response = await createCustomField({
          partyId: this.partnerId,
          label: fieldData.label,
          type: fieldData.type,
          values: fieldData.values,
          mandatoryVal: fieldData.mandatoryVal,
          isSpec: true,
        });
      }

      if (response && response.errors && response.errors.length) {
        // this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        response.errors.forEach(e => {
          this.flashMessage({ level: 'danger', message: e.message });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },
  },
};
</script>

<style lang="scss" scoped></style>
