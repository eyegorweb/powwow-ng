<template>
  <div class="d-flex justify-content-center">
    <div class="search-by-id">
      <SearchByLinesId @searchById="searchById" :init-value="searchByIdValue" disable-when-empty />
    </div>
  </div>
</template>

<script>
import SearchByLinesId from '@/views/GetParc/ActLines/SearchByLinesId';
import { mapMutations } from 'vuex';

export default {
  components: {
    SearchByLinesId,
  },

  data() {
    return {
      searchByIdValue: undefined,
    };
  },

  methods: {
    ...mapMutations('actLines', ['startSearchingById', 'setPage', 'setActCreationPrerequisites']),
    searchById(params) {
      this.searchByIdValue = params.value;
      this.setPage(1);
      this.startSearchingById([
        {
          id: params.id,
          value: params.value,
        },
      ]);

      this.setActCreationPrerequisites({
        searchById: params,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-by-id {
  width: 50%;
}
</style>
