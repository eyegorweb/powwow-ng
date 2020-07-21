<template>
  <div class="home">
    <div class="mb-4">
      <SearchTranslationKey />

      <DataTablePagination :page.sync="page" :total="200" :page-limit="10" />
    </div>
  </div>
</template>

<script>
// Composant sandbox, ne pas faire de review, c'est du jetable :)

import SearchTranslationKey from '@/components/utils/SearchTranslationKey';
import DataTablePagination from '@/components/DataTable/DataTablePagination.vue';

export default {
  name: 'Home',
  components: {
    SearchTranslationKey,
    DataTablePagination,
  },
  mounted() {},
  data() {
    return {
      page: 2,
    };
  },
};
</script>
