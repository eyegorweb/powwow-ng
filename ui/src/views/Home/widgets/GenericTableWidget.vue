<template>
  <Promised :promise="resultsPromise">
    <div slot="pending">{{ $t('loading') }}...</div>
    <div v-if="!rows || !rows.length" class="alert alert-light" role="alert">
      {{ $t('noResult') }}
    </div>
    <DataTable
      v-else
      :columns="columns"
      :rows="rows || []"
      :page.sync="page"
      :page-limit.sync="pageLimit"
      :total="0"
      :order-by.sync="orderBy"
      small-text
    />
  </Promised>
</template>

<script>
import { Promised } from 'vue-promised';
import DataTable from '@/components/DataTable/DataTable';

export default {
  components: {
    Promised,
    DataTable,
  },
  props: {
    columns: Array,
    rows: Array,
    resultsPromise: Promise,
  },

  data() {
    return {
      page: 0,
      pageLimit: 10,
      orderBy: { key: 'creationDate', direction: 'DESC' },
    };
  },
};
</script>

<style lang="scss" scoped></style>
