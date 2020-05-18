<template>
  <div class="mt-4">
    <label>{{ label }}</label>
    <UiInput v-if="isInput" v-model="value" block />
    <textarea v-if="isTextArea" v-model="value" class="form-control" rows="3"></textarea>
    <UiCheckbox v-if="isCheckbox" v-model="value" />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiInput,
    UiCheckbox,
  },
  props: {
    ptype: String,
    label: String,
    initValue: [String, Object],
  },

  mounted() {
    if (this.initValue) {
      console.log(this.ptype, this.initValue);
      if (this.ptype === 'Object' || this.ptype === 'Array') {
        this.value = JSON.stringify(this.initValue);
      } else {
        this.value = this.initValue;
      }
    }
  },

  computed: {
    isInput() {
      return this.ptype === 'String' || this.ptype === 'Number';
    },

    isTextArea() {
      return this.ptype === 'Object' || this.ptype === 'Array';
    },

    isCheckbox() {
      return this.ptype === 'Boolean';
    },
  },

  data() {
    return {
      value: undefined,
    };
  },

  watch: {
    value(newValue) {
      let value = newValue;
      if (this.ptype === 'Number') {
        value = parseInt(newValue);
      }
      if (this.ptype === 'Object' || this.ptype === 'Array') {
        value = JSON.parse(newValue);
      }
      this.$emit('change', value);
    },
  },
};
</script>

<style lang="scss" scoped></style>
