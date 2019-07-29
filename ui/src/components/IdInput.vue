<template>
  <div :class="{ error: haveValue && !isValid, valid: haveValue && isValid }">
    <UiInput v-model="value" class="input-block m-0" :no-hover-style="!!haveValue" />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';
import startsWith from 'lodash.startswith';

export default {
  components: {
    UiInput,
  },

  data() {
    return {
      value: undefined,
    };
  },

  props: {
    type: String,
  },

  computed: {
    haveValue() {
      return this.value && !!this.value.length;
    },
    isValid() {
      if (this.value) {
        const len = this.value.length;

        if (this.type === 'ICCID') {
          return len === 19 && startsWith(this.value, '893320');
        }

        if (this.type === 'MSISDN') {
          return (len === 15 || len === 11) && startsWith(this.value, '33');
        }
      }
      return false;
    },
  },

  watch: {
    value() {
      if (this.isValid) {
        this.$emit('validValue', this.value);
      } else {
        this.$emit('invalidValue', this.value);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.error {
  border: 2px solid red;
  border-radius: 3px;
}
.valid {
  border: 2px solid $success;
  border-radius: 3px;
}
.input-block {
  width: 100%;
}
</style>
