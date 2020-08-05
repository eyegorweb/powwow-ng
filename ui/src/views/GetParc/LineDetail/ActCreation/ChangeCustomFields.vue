<template>
  <BaseForm
    warning-msg="getparc.actCreation.changeCustomFields.confirmationWarning"
    :validate-fn="doRequest"
    :can-send="canSend"
  >
    <div class="overview-item mr-5">
      <h6>{{ $t('getparc.actCreation.step2Titles.CUSTOM_FIELDS') }} :</h6>
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
import PartnerFields from '@/components/PartnerFields';
import { mapState, mapGetters } from 'vuex';
import { changeSingleCustomFields } from '@/api/actCreation';
import FormReport from './FormReport';

export default {
  components: {
    BaseForm,
    PartnerFields,
    FormReport,
  },

  props: {
    lineData: Object,
  },

  data() {
    return {
      allCustomFields: [],
      allSpecificFields: [],
      customFieldsValues: [],
      customFieldsErrors: undefined,
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
        simCardId: this.lineData.id,
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

      this.chekcForErrors();
      const response = await changeSingleCustomFields(params);
      if (response) {
        return { report: { ...response.data.changeCustomFieldsV2 }, errors: response.errors };
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
    chekcForErrors() {
      const getCustomFieldValue = code => {
        const found = this.customFieldsValues.filter(c => c.code === code);
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
    arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      for (var i = arr1.length; i--; ) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
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
    canSend() {
      // si les deux tableaux sont identiques après saisie des nouvelles valeurs, alors nous ne pouvons pas valider
      const areEqualArrays = this.arraysEqual(
        this.allCustomFields.map(c => {
          return c.enteredValue;
        }),
        this.customFieldsValues.map(c => {
          return c.enteredValue;
        })
      );
      if (areEqualArrays) return false;

      // si tous les champs sont optionnels, alors nous pouvons envoyer le formulaire avant tout changement
      if (this.allCustomFields.filter(c => c.isOptional).length === this.allCustomFields.length) {
        return true;
      }

      // sinon si un champ de type liste est obligatoire, il faut entrer une valeur non nulle (itemListRequiredNotNull) et
      // pour chaque champ obligatoire, il faut que la valeur ne soit plus vide
      else {
        const itemListRequiredNotNull = this.customFieldsValues.length
          ? this.allCustomFields.filter(c => !c.isOptional && c.type === 'LIST').length ===
            this.customFieldsValues.filter(
              c => !c.isOptional && c.type === 'LIST' && c.enteredValue !== 'none'
            ).length
          : false;
        return (
          this.allCustomFields.filter(c => !c.isOptional).length ===
            this.customFieldsValues.filter(c => !c.isOptional && c.enteredValue).length &&
          itemListRequiredNotNull
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
