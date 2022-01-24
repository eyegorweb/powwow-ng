<template>
  <div class="inputs-container">
    <div class="field-inp" :key="discount.label" v-for="discount in localDiscounts">
      <FormControl
        input-type="number"
        :label="discount.label"
        v-model="discount.discountValue"
        :min-value="discount.lowerBound"
        :max-value="discount.upperBound"
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
    const sortAlphaNum = (a, b) => a.label.localeCompare(b.label, 'en', { numeric: true });
    this.localDiscounts = this.dicounts
      .map((d) => ({
        label: d.discount.code + ' (%)',
        code: d.discount.code,
        discountValue: d.discountValue,
        lowerBound: d.lowerBound,
        upperBound: d.upperBound,
      }))
      .filter((i) => i.code !== undefined)
      .sort(sortAlphaNum);
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
