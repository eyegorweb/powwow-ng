<template>
  <div>
    <div v-for="item in customFields" :key="item.id" class="mb-1">
      <div v-if="item.type === 'TEXT'">
        {{ item.label }}
        <span v-if="showOptionalField && item.isOptional" class="text-optional"
          >[{{ $t('optional') }}]</span
        >

        <UiInput
          @update:value="newVal => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
          class="d-block"
        />
      </div>
      <div class="form-group" v-if="!editingList && item.type === 'LIST'">
        <label>
          {{ item.label }}
          <span v-if="showOptionalField && item.isOptional" class="text-optional"
            >[{{ $t('optional') }}]</span
          >
          <button v-if="canEditList" class="btn btn-link p-0" @click="editingList = true">
            {{ $t('modify') }}
          </button>
        </label>
        <br />
        <UiSelect
          placeholder="-"
          :value="getSelectedValue(item.code)"
          @input="newVal => onValueChanged(item, newVal)"
          :options="item.value"
          class="select-filter"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
        />
      </div>
      <div class="form-group" v-if="editingList && item.type === 'LIST'">
        <label>
          {{ item.label }}
          <span v-if="showOptionalField && item.isOptional" class="text-optional"
            >[{{ $t('optional') }}]</span
          >
        </label>
        <EditCustomField
          v-if="canEditList"
          :options="item.value"
          @close="editingList = false"
          @addValueToList="newItem => $emit('addValueToList', newItem, item)"
        />
      </div>
      <div v-if="item.type === 'DATE'">
        {{ item.label }}
        <span v-if="showOptionalField && item.isOptional" class="text-optional"
          >[{{ $t('optional') }}]</span
        >
        <UiDate
          :direction="direction"
          @change="newVal => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code) || currentDate"
          class="d-block"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
          time-picker
        >
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
import EditCustomField from '@/components/EditCustomField';
import moment from 'moment';

export default {
  props: {
    /**
     * format : {id, code, type, value}
     */
    customFields: {
      type: Array,
    },
    getSelectedValue: Function,
    errors: {
      type: Array,
    },
    canEditList: Boolean,
    showOptionalField: Boolean,
    direction: String,
  },
  components: {
    UiInput,
    UiSelect,
    UiDate,
    EditCustomField,
  },
  data() {
    return {
      editingList: false,
      currentDate: undefined,
    };
  },
  mounted () {
    this.currentDate = moment().format('DD/MM/YYYY hh:mm:ss');
  },
  methods: {
    onValueChanged(item, newVal) {
      this.$emit('change', item, newVal);
    },
    inError(code) {
      const found = this.errors && this.errors.find(e => e === code);
      return !!found;
    },
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
