<template>
  <UiCheckbox v-model="value"> </UiCheckbox>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  name: 'CheckBoxCell',
  components: {
    UiCheckbox,
  },
  props: {
    row: Object,
  },
  data() {
    return {
      value: false,
    };
  },

  watch: {
    value(isChecked) {
      if (isChecked) {
        this.$emit('colEvent', { add: this.row });
      } else {
        this.$emit('colEvent', { remove: this.row });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
