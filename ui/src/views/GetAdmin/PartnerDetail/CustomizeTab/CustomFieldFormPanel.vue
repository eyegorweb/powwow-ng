<template>
  <AddCustomField
    panel="admin"
    label-title="libre"
    :is-updating="!!content.modifyCustomField"
    fixheight
    :close="closePanel"
    @add-field="save"
    :number-of-custom-fields="content.currentNbCF"
    :prefilledValues="prefilledValues"
  />
</template>

<script>
import BaseDetailPanelContent from '@/components/BaseDetailPanelContent';
import AddCustomField from '@/views/GetSim/CreateOrder/StepSettings/AddCustomField';
import { formattedCurrentDate } from '@/utils/date';
import { createCustomField, updateCustomFieldLabel } from '@/api/customFields';
import { mapMutations } from 'vuex';

export default {
  components: {
    BaseDetailPanelContent,
    AddCustomField
  },

  props: {
    content: Object,
  },

  computed: {
    prefilledValues() {
      if (this.content.modifyCustomField) {
        return {
          label: this.content.modifyCustomField.label,
          type: this.content.modifyCustomField.type,
          listOptions: this.content.modifyCustomField.value || [],
          mandatory: this.content.modifyCustomField.mandatory
        }
      }
    }
  },

  methods: {
    ...mapMutations(['flashMessage', 'closePanel']),

    async save(fieldData) {
      let response;

      if (this.content.modifyCustomField) {
        response = await this.updateExisting(fieldData);
      } else {
        response = await this.saveNew(fieldData);
      }

      if (response && response.errors && response.errors.length) {
        response.errors.forEach(e => {
          this.flashMessage({ level: 'danger', message: e.message });
        });
      } else {
        this.flashMessage({ level: 'success', message: this.$t('genericSuccessMessage') });
      }

      this.closePanel({ resetSearch: true });
    },

    async saveNew(fieldData) {
      return await createCustomField({
        partyId: this.content.partnerId,
        label: fieldData.label,
        type: fieldData.type,
        values: fieldData.values,
        mandatoryVal: fieldData.mandatoryVal,
        isSpec: false,
      });
    },

    async updateExisting(fieldData) {
      return await updateCustomFieldLabel(this.content.partnerId,
        this.content.modifyCustomField.code,
        fieldData.label
      );
    }

  },
}
</script>

<style lang="scss" scoped>

</style>
