<template>
  <Promised :promise="resultsPromise">
    <div slot="pending">
      <TableSkeleton :columns="columns" :size="3" />
    </div>
    <div slot="rejected" slot-scope="{ error }">{{ error }}</div>
    <div v-if="!rows || !rows.length" class="alert-light" role="alert">
      {{ $t('noResult') }}
    </div>
    <DataTable
      v-else
      :columns="columns"
      :rows="rows || []"
      :page.sync="page"
      :page-limit.sync="pageLimit"
      :total="0"
      :order-by.sync="_orderBY"
      small-text
    />
  </Promised>
</template>

<script>
import { Promised } from 'vue-promised';
import DataTable from '@/components/DataTable/DataTable';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

export default {
  components: {
    Promised,
    DataTable,
    TableSkeleton,
  },
  props: {
    columns: Array,
    rows: Array,
    resultsPromise: Promise,
    orderBy: {
      type: Object,
    },
  },
  //{ key: 'creationDate', direction: 'DESC' };
  computed: {
    _orderBY: {
      get() {
        return this.orderBy;
      },
      set(value) {
        this.$emit('update:orderBy', value);
      },
    },
  },

  data() {
    return {
      page: 0,
      pageLimit: 10,
    };
  },
};
</script>

<style lang="scss" scoped></style>
