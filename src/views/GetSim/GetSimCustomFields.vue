<template>
  <div clas="container">
    <CustomFields
      :fields="filterCustomFieldsList"
      :get-selected-value="getSelectedValue"
      @change="onValueChanged"
    />
  </div>
</template>

<script>
import CustomFields from '@/components/CustomFields';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'GetSimCustomFields',

  data() {
    return {
      searchedField: undefined,
      selectedPartner: null,
      selectedDate: undefined,
    };
  },

  computed: {
    ...mapGetters(['filterCustomFieldsList', 'selectedCustomFieldsValues']),
  },

  methods: {
    ...mapMutations(['setCustomFieldsFilter']),
    getSelectedValue(code) {
      if (this.selectedCustomFieldsValues && this.selectedCustomFieldsValues.length > 0) {
        const selected = this.selectedCustomFieldsValues.find(c => c.id === code);
        if (selected) {
          return selected.value;
        }
      }
      return '';
    },
    onValueChanged(customField, newVal) {
      let selectedCustomFieldsValues = [];
      const labelForSynthesis = customField.label + ': ' + newVal;
      if (this.selectedCustomFieldsValues) {
        selectedCustomFieldsValues = this.selectedCustomFieldsValues;
      }
      const selected = selectedCustomFieldsValues.find(s => s.id === customField.code);
      if (selected) {
        selected.value = newVal;
        this.setCustomFieldsFilter(
          selectedCustomFieldsValues.filter(s => s.value && s.value.length > 0).map(s => {
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
  },

  components: {
    CustomFields,
  },
};
</script>

<style lang="scss" scoped>
select {
  width: 100%;
}
</style>
