<template>
  <UiCheckbox v-model="value"> </UiCheckbox>
</template>

<script>
import UiCheckbox from '@/components/ui/Checkbox';

export default {
  components: {
    UiCheckbox,
  },
  props: {
    rows: Object,
  },
  data() {
    return {
      value: false,
    };
  },
  watch: {
    value(newValue) {
      this.$emit('update:value', newValue);
    },
  },
};
</script>

<style lang="scss" scoped></style>
