<template>
  <AddCustomField
    :panel="panel"
    :label-title="label"
    :is-updating="!!content.modifySpecificField"
    fixheight
    :close="closePanel"
    @add-field="save"
    :number-of-custom-fields="content.currentNbCF"
    :prefilled-values="prefilledValues"
  />
</template>

<script>
import AddCustomField from '@/views/GetSim/CreateOrder/StepSettings/AddCustomField';
import { mapMutations } from 'vuex';
import { updateCustomFieldLabel, createCustomField } from '@/api/customFields';

export default {
  components: {
    AddCustomField,
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
      label: this.$t('specific'),
      direction: 'down',
    };
  },

  computed: {
    actionLabel() {
      return this.label ? this.$t('orders.modify-custom-field-action', { label: this.label }) : '';
    },
    prefilledValues() {
      if (this.content.modifySpecificField) {
        return {
          label: this.content.modifySpecificField.spec,
          type: this.content.modifySpecificField.type,
          listOptions: this.content.modifySpecificField.value || [],
          mandatory: this.content.modifySpecificField.mandatory,
        };
      }
      return undefined;
    },
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async save(fieldData) {
      let response;

      if (this.content.modifySpecificField) {
        response = await this.updateExistingCF(fieldData);
      } else {
        response = await this.saveNewCF(fieldData);
      }

      if (response && response.errors && response.errors.length) {
        // this.flashMessage({ level: 'danger', message: this.$t('genericErrorMessage') });
        response.errors.forEach((e) => {
          this.flashMessage({ level: 'danger', message: e.message });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },

    async saveNewCF(fieldData) {
      return await createCustomField({
        partyId: this.content.partnerId,
        label: fieldData.label,
        type: fieldData.type,
        values: fieldData.values,
        mandatoryVal: fieldData.mandatoryVal,
        isSpec: true,
      });
    },

    async updateExistingCF(fieldData) {
      return await updateCustomFieldLabel(
        this.content.partnerId,
        this.content.modifySpecificField.code,
        fieldData.label,
        fieldData.type,
        fieldData.values,
        fieldData.mandatoryVal
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
