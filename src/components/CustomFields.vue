<template>
  <div>
    <div v-for="item in fields" :key="item.id" class=" mb-1">
      <div v-if="item.type === 'TEXT'">
        <!-- TODO: to translate -->
        {{ $t('customFields.' + item.code) }}
        <UiInput
          @update:value="(newVal) => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          class="d-block"
        />
      </div>
      <div class="form-group" v-if="item.type === 'LIST'">
        <label>{{ $t('customFields.' + item.code) }}</label>
        <br>
        <UiSelect
          placeholder="Choisissez une valeur"
          @input="(newVal) => onValueChanged(item, newVal)"
          :options="item.value"
          class="select-filter"
        />
      </div>
      <div v-if="item.type === 'DATE'">
        {{ $t('customFields.' + item.code) }}
        <UiDate
          @change="(newVal) => onValueChanged(item, newVal)"
          :value="getSelectedValue(item.code)"
          class="d-block"
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
  },
};
</script>

<style scoped>
.select-filter {
  width: 100%;
}
</style>
