<template>
  <div>
    <DoubleInput :value1="inputFrom" :value2="inputTo" @input="onChange" />
  </div>
</template>

<script>
import DoubleInput from '@/components/ui/DoubleInput';

export default {
  components: {
    DoubleInput,
  },
  props: {
    selectedData: Object,
  },

  methods: {
    onChange({ inputFrom, inputTo }) {
      this.$emit('change', {
        from: inputFrom,
        to: inputTo,
      });
    },
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
