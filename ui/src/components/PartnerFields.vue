<template>
  <div>
    <template v-if="customFields">
      <CustomFields
        :custom-fields="customFields"
        :get-selected-value="getSelectedValue"
        :errors="errors"
        :can-edit-list="canEditList"
        :show-optional-field="showOptionalField"
        @change="onValueChanged"
      />
    </template>
    <template v-if="specificFields && !userIsPartner">
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
</template>

<script>
import CustomFields from '@/components/CustomFields';
import SpecificFields from '@/components/SpecificFields';
import { mapGetters } from 'vuex';

export default {
  props: {
    /**
     * format : {id, code, type, value}
     */
    customFields: {
      type: Array,
    },
    specificFields: {
      type: Array,
    },
    getSelectedValue: Function,
    errors: {
      type: Array,
    },
    canEditList: Boolean,
    showOptionalField: Boolean,
  },
  components: {
    CustomFields,
    SpecificFields,
  },
  data() {
    return {
      editingList: false,
    };
  },
  methods: {
    onValueChanged(item, newVal) {
      this.$emit('change', item, newVal);
    },
  },
  computed: {
    ...mapGetters(['userIsPartner']),
  },
};
</script>

<style scoped>
.select-filter {
  width: 100%;
}
.text-optional {
  font-size: 0.9rem;
  font-weight: 400;
}
</style>
