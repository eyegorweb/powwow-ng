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
  </ActFormContainer>
</template>

<script>
import ActFormContainer from './parts/ActFormContainer';
import CustomFields from '@/components/CustomFields';
import { mapState, mapGetters } from 'vuex';
import { fetchCustomFields } from '@/api/customFields';
import { updateCustomFields } from '@/api/actCreation';

export default {
  components: {
    ActFormContainer,
    CustomFields,
  },
  data() {
    return {
      allCustomFields: [],
      customFieldsValues: [],
      customFieldsErrors: [],
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
      };
      return await updateCustomFields(
        this.appliedFilters,
        this.selectedLinesForActCreation,
        params
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
