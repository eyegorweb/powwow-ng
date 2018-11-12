<template>
  <div>
    <MultiChoices
      v-if="filter.type === 'choices'"
      :values="filter.values"
      :selected-values.sync="optionValue"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import MultiChoices from '@/components/MultiChoices';

export default {
  name: 'FilterOption',
  components: {
    MultiChoices,
  },
  props: {
    filter: {
      type: Object,
    },
  },
  data() {
    return {
      value: [],
    };
  },

  methods: {
    ...mapMutations(['selectFilterValue']),
  },

  created() {
    const selectedFilter = this.$store.getters.currentFilters.find(
      f => f.name === this.filter.name
    );
    if (!selectedFilter) {
      this.selectFilterValue({
        name: this.filter.name,
        newValue: [],
      });
    }
  },

  computed: {
    optionValue: {
      get() {
        const selectedFilter = this.$store.getters.currentFilters.find(
          f => f.name === this.filter.name
        );
        return selectedFilter.values;
      },
      set(newValue) {
        this.selectFilterValue({
          name: this.filter.name,
          newValue,
        });
        this.value = newValue;
      },
    },
  },
};
</script>

<style scoped>
</style>
