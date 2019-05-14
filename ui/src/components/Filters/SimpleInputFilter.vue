<template>
  <div>
    <UiInput v-model="value" :input-type="inputType" :min-value="minValue" />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  props: {
    selectedValue: [String, Number],
    inputType: {
      type: String,
      default: 'text',
    },
    minValue: {
      type: Number,
      required: false,
    },
  },
  computed: {
    value: {
      get() {
        return this.selectedValue;
      },
      set(newValue) {
        this.$emit('update:value', newValue);
      },
    },
  },
  components: {
    UiInput,
  },
};
</script>

<style scoped>
label {
  width: 100%;
}
</style>
