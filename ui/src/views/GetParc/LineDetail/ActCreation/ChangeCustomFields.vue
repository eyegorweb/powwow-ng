<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeCustomFields.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.step2Titles.CUSTOM_FIELDS') }} :</h6>
      <div>
        <CustomFields
          :fields="allCustomFields"
          :get-selected-value="getSelectedValue"
          :errors="customFieldsErrors"
          @change="onValueChanged"
        />
      </div>
      <div slot="after" slot-scope="{ report }">
        <FormReport v-if="report" :data="report" />
      </div>
    </div>
  </BaseForm>
</template>

<script>
import BaseForm from './BaseForm';
import get from 'lodash.get';
import { fetchCustomFields } from '@/api/customFields';
import CustomFields from '@/components/CustomFields';
import { mapState, mapGetters } from 'vuex';
import { updateCustomFields } from '@/api/actCreation';
import FormReport from './FormReport';

export default {
  components: {
    BaseForm,
    CustomFields,
    FormReport,
  },

  props: {
    lineData: Object,
  },

  data() {
    return {
      canSend: false,
      allCustomFields: [],
      customFieldsValues: [],
      customFieldsErrors: [],
      waitForConfirmation: false,
    };
  },

  async mounted() {
    await this.fetchCustomFieldsForPartner();

    // préremplir les valeurs des champs libres
    const currentCustomFields = this.currentCustomFields;

    if (currentCustomFields && currentCustomFields.length) {
      currentCustomFields.forEach(c => {
        const correspondingField = this.allCustomFields.find(cf => cf.code === c.code);
        if (correspondingField) {
          this.onValueChanged(correspondingField, c.value);
        }
      });
    }
  },

  methods: {
    async fetchCustomFieldsForPartner() {
      const partnerId = get(this.lineData, 'party.id');
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
    async doRequest(context) {
      const { notificationCheck, actDate } = context;
      const getCustomFieldValue = code => {
        const found = this.customFieldsValues.filter(c => c.code === code);
        if (found && found.length) {
          return found[0].enteredValue;
        }
        return '';
      };
      const params = {
        partyId: this.lineData.party.id,
        notifEmail: notificationCheck,
        dueDate: actDate,
        custom1: getCustomFieldValue('custom1'),
        custom2: getCustomFieldValue('custom2'),
        custom3: getCustomFieldValue('custom3'),
        custom4: getCustomFieldValue('custom4'),
        custom5: getCustomFieldValue('custom5'),
        custom6: getCustomFieldValue('custom6'),
        spec1: getCustomFieldValue('spec1'),
        spec2: getCustomFieldValue('spec2'),
      };
      const response = await updateCustomFields([], [this.lineData], params);
      if (response) {
        return {
          report: { successful: response.data.changeCustomFields },
          errors: response.errors,
        };
      }
    },
    getCustomFieldLabel(index) {
      const found = this.allCustomFields.find(c => c.code === `custom${index}`);
      if (found) {
        return found.label;
      } else {
        return this.$t('customFields.customField', { index });
      }
    },
  },

  computed: {
    ...mapState('actLines', ['selectedLinesForActCreation']),
    ...mapGetters('actLines', ['appliedFilters']),
    currentCustomFields() {
      const customFields = get(this.lineData, 'accessPoint.customFields');
      if (!customFields) return [];
      let customFieldsArray = [];
      for (let i = 1; i <= 6; i++) {
        const value = customFields['custom' + i];
        const label = this.getCustomFieldLabel(i);
        if (value) {
          customFieldsArray.push({
            index: i,
            code: 'custom' + i,
            value,
            label,
          });
        }
      }
      return customFieldsArray;
    },
  },
};
</script>

<style lang="scss" scoped></style>
