<template>
  <InputRange
    type="number"
    :from="selectedQuantityValues ? selectedQuantityValues.from: 0"
    :to="selectedQuantityValues ? selectedQuantityValues.to: 0"
    @change="onChange"
  />
</template>

<script>
import InputRange from '@/components/ui/InputRange';
import { mapMutations, mapGetters } from 'vuex';

export default {
  components: {
    InputRange,
  },
  computed: {
    ...mapGetters(['selectedQuantityValues']),
  },
  methods: {
    ...mapMutations(['setQuantityFilter']),
    onChange({ from, to }) {
      this.setQuantityFilter({
        id: 'filters.quantity',
        value: `${from} → ${to}`,
        from,
        to,
      });
    },
  },
};
</script>

<style scoped>
</style>
