<template>
  <div clas="container">
    <PartnerFields
      :custom-fields="customFields"
      :get-selected-value="getSelectedValue"
      @change="onValueChanged"
    />
  </div>
</template>

<script>
import PartnerFields from '@/components/PartnerFields';

export default {
  name: 'GetSimCustomFields',

  props: {
    customFields: Array,
    values: Array,
  },

  data() {
    return {
      searchedField: undefined,
      selectedPartner: null,
      selectedDate: undefined,
    };
  },

  computed: {},

  methods: {
    getSelectedValue(code) {
      if (this.values && this.values.length > 0) {
        const selected = this.values.find(c => c.id === code);
        if (selected) {
          return selected.value;
        }
      }
      return '';
    },
    onValueChanged(customField, newVal) {
      let selectedCustomFieldsValues = [];
      const labelForSynthesis = customField.label + ': ' + newVal;
      if (this.values) {
        selectedCustomFieldsValues = this.values;
      }
      const selected = selectedCustomFieldsValues.find(s => s.id === customField.code);
      if (selected) {
        selected.value = newVal;
        this.setCustomFieldsFilter(
          selectedCustomFieldsValues
            .filter(s => s.value && s.value.length > 0)
            .map(s => {
              if (s.id === selected.id) {
                selected.label = labelForSynthesis;
                return selected;
              } else {
                return s;
              }
            })
        );
      } else {
        this.setCustomFieldsFilter([
          ...selectedCustomFieldsValues,
          {
            id: customField.code,
            value: newVal,
            label: labelForSynthesis,
          },
        ]);
      }
    },

    setCustomFieldsFilter(newValues) {
      this.$emit('updateCustomFields', newValues);
    },
  },

  components: {
    PartnerFields,
  },
};
</script>

<style lang="scss" scoped>
select {
  width: 100%;
}
</style>
