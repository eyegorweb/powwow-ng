<template>
  <BaseDetailPanelContent white>
    <div class="m-3">
      <div class="entries-line">
        <div class="form-entry">
          <template v-if="specificFields.length > 0 && !userIsPartner">
            <SpecificFields
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
    <div slot="footer" class="action-buttons">
      <div>
        <UiButton variant="import" block @click="closePanel">{{ $t('cancel') }}</UiButton>
      </div>
      <div>
        <UiButton :disabled="!canSave" variant="primary" @click="save" block>{{
          $t('save')
        }}</UiButton>
      </div>
    </div>
  </BaseDetailPanelContent>
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import SpecificFields from '@/components/SpecificFields';
import { mapMutations } from 'vuex';
import { updateCustomFields } from '@/api/actCreation';
import { createCustomField } from '@/api/customFields';
import { formattedCurrentDate } from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  components: {
    BaseDetailPanelContent,
    SpecificFields,
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
    };
  },

  mounted() {
    this.partnerId = this.content.partnerId;
    if (this.content && this.content.modifyCustomField) {
      this.customFields.push(this.content.modifyCustomField);
      this.specificFields.push(this.content.modifyCustomField);
    } else {
      this.addCustomField = true;
    }
  },

  computed: {
    ...mapGetters(['userIsPartner']),
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
