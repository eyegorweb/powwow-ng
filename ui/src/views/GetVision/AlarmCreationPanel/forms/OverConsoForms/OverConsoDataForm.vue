<template>
  <OverConsoGenericForm
    :get-percent-val-fn="getPercentVal"
    :active.sync="active_"
    @change="$emit('change', $event)"
  />
</template>

<script>
import OverConsoGenericForm from './OverConsoGenericForm';
import { propWithSync } from '@/mixins';

export default {
  components: {
    OverConsoGenericForm,
  },
  mixins: [propWithSync('active')],

  props: {
    offerPackage: Object,
  },

  data() {
    return {
      max: undefined,
      unit: undefined,
    };
  },
  computed: {
    name() {
      return this.data;
    },
  },
  methods: {
    getPercentVal(value) {
      if (!this.offerPackage || !this.offerPackage.envelopeValue) return undefined;

      const calculated = Math.round((value * this.offerPackage.envelopeValue) / 100);
      if (!isNaN(calculated)) {
        return `(${calculated} ${this.offerPackage.unit})`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
