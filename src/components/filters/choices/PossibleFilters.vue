<template>
  <draggable>
    <transition-group>
      <FoldableBlock
        v-for="f in allAvailableFilters"
        :title="f.title"
        :key="f.name"
        draggable
      >
        <FilterOption :filter="f" />
      </FoldableBlock>
    </transition-group>

  </draggable>
</template>

<script>
import draggable from 'vuedraggable';
import FoldableBlock from './FoldableBlock';
import FilterOption from './FilterOption';

export default {
  name: 'PossibleFilters',
  components: {
    draggable,
    FoldableBlock,
    FilterOption,
  },
  props: {
    allAvailableFilters: {
      type: Array,
    },
  },
};
</script>

<style scoped>
</style>
