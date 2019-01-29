<template>
  <div clas="container">
    <div v-for="item in filterCustomFieldsList" :key="item.id" class="container">
      <div v-if="item.type === 'TEXT'">
        <!-- TODO: to translate -->
        {{ $t('customFields.' + item.code) }}
        <UiInput
          @update:value="(newVal) => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          class="d-block"
        />
      </div>
      <label v-if="item.type === 'LIST'">
        {{ $t('customFields.' + item.code) }}
        <UiSelect
          placeholder="Choisissez une valeur"
          v-model="selectedPartner"
          :options="item.value"
        />
      </label>
      <div v-if="item.type === 'DATE'">
        {{ $t('customFields.' + item.code) }}
        <UiDate :date-value.sync="selectedDate" class="d-block">
          <i slot="icon" class="select-icon ic-Flag-Icon" />
        </UiDate>
      </div>
    </div>
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiSelect from '@/components/ui/UiSelect';
import UiDate from '@/components/ui/UiDate';
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
      const labelForSynthesis = this.$t('customFields.' + customField.code) + ': ' + newVal;
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
    UiInput,
    UiSelect,
    UiDate,
  },
};
</script>

<style lang="scss" scoped>
select {
  width: 100%;
}
</style>
