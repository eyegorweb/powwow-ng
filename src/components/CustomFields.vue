<template>
  <div>
    <div v-for="item in fields" :key="item.id" class=" mb-1">
      <div v-if="item.type === 'TEXT'">
        {{ item.label }} <span v-if="item.mandatory === 'ORDER'">({{ $t('required') }})</span>

        <UiInput
          @update:value="newVal => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
          class="d-block"
        />
      </div>
      <div class="form-group" v-if="item.type === 'LIST'">
        <label>{{ item.label }}</label>
        <br />
        <UiSelect
          placeholder="Choisissez une valeur"
          :value="getSelectedValue(item.code)"
          @input="newVal => onValueChanged(item, newVal)"
          :options="item.value"
          class="select-filter"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
        />
      </div>
      <div v-if="item.type === 'DATE'">
        {{ item.label }}
        <UiDate
          @change="newVal => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          class="d-block"
          :error="inError(item.code) ? 'errors.mandatory' : undefined"
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
import UiDate from '@/components/ui/UiDate2';

export default {
  props: {
    /**
     * format : {id, code, type, value}
     */
    fields: {
      type: Array,
    },
    getSelectedValue: Function,
    errors: {
      type: Array,
    },
  },
  components: {
    UiInput,
    UiSelect,
    UiDate,
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
</style>
