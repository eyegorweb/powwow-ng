<template>
  <InputRange
    type="number"
    :from="selectedQuantityValues ? selectedQuantityValues.from: ''"
    :to="selectedQuantityValues ? selectedQuantityValues.to: ''"
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
