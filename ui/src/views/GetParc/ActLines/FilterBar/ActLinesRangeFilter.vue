<template>
  <div>
    <DoubleInput :value1="value1" :value2="value2" @input="onChange" />
  </div>
</template>

<script>
import DoubleInput from '@/components/ui/DoubleInput';

export default {
  props: {
    values: Object,
  },
  components: {
    DoubleInput,
  },
  methods: {
    onChange({ value1, value2 }) {
      this.$emit('update:values', {
        from: value1,
        to: value2,
      });
    },
  },
  computed: {
    value1() {
      if (!this.values) return undefined;
      return this.values.from;
    },

    value2() {
      if (!this.values) return undefined;
      return this.values.to;
    },
  },
};
</script>

<style lang="scss" scoped></style>
