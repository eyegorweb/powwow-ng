<template>
  <div>
    <UiInput v-model="inputFrom" block />
    <UiInput v-model="inputTo" block />
  </div>
</template>

<script>
import UiInput from '@/components/ui/UiInput';

export default {
  components: {
    UiInput,
  },
  props: {
    selectedData: Object,
  },

  computed: {
    inputTo: {
      get() {
        return this.selectedData ? this.selectedData.to : undefined;
      },
      set(value) {
        this.$emit('change', {
          to: value,
          from: this.inputFrom,
        });
      },
    },
    inputFrom: {
      get() {
        return this.selectedData ? this.selectedData.from : undefined;
      },
      set(value) {
        this.$emit('change', {
          from: value,
          to: this.inputTo,
        });
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
