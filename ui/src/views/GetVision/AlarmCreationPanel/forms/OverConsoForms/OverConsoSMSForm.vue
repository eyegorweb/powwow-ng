<template>
  <OverConsoGenericForm value-label="Nb de SMS dépasse" :get-percent-val-fn="getPercentVal" />
</template>

<script>
import OverConsoGenericForm from './OverConsoGenericForm';

export default {
  components: {
    OverConsoGenericForm,
  },
  data() {
    return {
      max: 500,
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
        return `(${calculated})`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
