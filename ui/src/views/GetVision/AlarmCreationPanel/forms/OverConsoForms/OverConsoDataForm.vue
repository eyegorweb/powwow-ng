<template>
  <OverConsoGenericForm
    value-label="La data dépasse"
    :get-percent-val-fn="getPercentVal"
    @change="$emit('change', $event)"
  />
</template>

<script>
import OverConsoGenericForm from './OverConsoGenericForm';

export default {
  components: {
    OverConsoGenericForm,
  },
  data() {
    return {
      max: 300,
    };
  },
  computed: {
    name() {
      return this.data;
    },
  },
  methods: {
    getPercentVal(value) {
      const calculated = Math.round((value * this.max) / 100);
      if (!isNaN(calculated)) {
        return `(${calculated} Mo)`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
