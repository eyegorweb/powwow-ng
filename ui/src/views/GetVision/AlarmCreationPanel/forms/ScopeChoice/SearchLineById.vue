<template>
  <SearchById
    @searchById="searchById"
    :init-value="searchByIdValue"
    :additional-ids="[]"
    placeholder="searchLine"
    :inline="false"
  />
</template>

<script>
import SearchById from '@/components/SearchById';

export default {
  components: {
    SearchById,
  },

  data() {
    return {
      searchByIdValue: undefined,
    };
  },
  methods: {
    searchById(params) {
      this.searchByIdValue = params.value;
      console.log('searchById', params);
    },
  },
};
</script>

<style lang="scss" scoped></style>
