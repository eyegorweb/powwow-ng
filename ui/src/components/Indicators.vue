<template>
  <ul class="list-group bg-white">
    <IndicatorItem
      v-for="indicator in meta"
      :key="indicator.labelKey"
      :indicator="indicator"
      :partners="partners"
    />
  </ul>
</template>

<script>
import IndicatorItem from './IndicatorItem';

export default {
  components: {
    IndicatorItem,
  },
  props: {
    meta: Array,
    setCurrentFiltersFn: Function,
    partners: Object,
  },

  data() {
    return {
      indicators: [],
      isIndicatorsLoading: false,
    };
  },

  watch: {
    meta() {},
  },

  methods: {},
};
</script>

<style lang="scss" scoped></style>
