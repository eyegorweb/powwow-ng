<template>
  <OverConsoGenericForm
    value-label="getvsion.alarm-creation.dataIsOver"
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
      //const envelopeValue = this.offerPackage.envelopeValue;
     // const unit = this.offerPackage.unit;
      const unit = 'Mo';
      const envelopeValue = 200;

     // if (!this.offerPackage || !envelopeValue) return undefined;

      const calculated = Math.round((value * envelopeValue) / 100);
      if (!isNaN(calculated)) {
        return `(${calculated} ${unit})`;
      }
      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
