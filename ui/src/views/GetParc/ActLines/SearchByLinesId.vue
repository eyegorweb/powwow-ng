<template>
  <SearchById @searchById="searchById" :init-value="initValue" placeholder="searchLine" />
</template>

<script>
import SearchById from '@/components/SearchById';

export default {
  components: {
    SearchById,
  },
  props: {
    initValue: {
      type: String,
    },
  },

  methods: {
    searchById(params) {
      this.$emit('searchById', params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
