<template>
  <div class="inputs-container">
    <div class="field-inp" :key="discount.label" v-for="discount in localDiscounts">
      <FormControl
        input-type="number"
        :label="discount.label"
        v-model="discount.value"
        :min-value="discount.minValue"
        :max-value="discount.maxValue"
        bold-label
        no-trad
        @update:value="$emit('change', localDiscounts)"
      >
        <div v-if="disabled">{{ discount.value }}</div>
      </FormControl>
    </div>
  </div>
</template>

<script>
import FormControl from '@/components/ui/FormControl';

export default {
  components: {
    FormControl,
  },
  props: {
    dicounts: Array,
    disabled: Boolean,
  },
  data() {
    return {
      localDiscounts: [],
    };
  },

  mounted() {
    this.localDiscounts = this.dicounts.map(d => ({
      label: d.discount.code + ' (%)',
      code: d.discount.code,
      value: d.discountValue,
      minValue: d.lowerBound,
      maxValue: d.upperBound,
    }));
  },
};
</script>

<style lang="scss" scoped>
.inputs-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.field-inp {
  flex-basis: 48%;
}
</style>
