<template>
  <div>
    <h4 class="text-primary text-uppercase">
      {{ $t('getparc.actLines.massActionsHistory.title') }}
    </h4>
    <div class="bg-white p-4 rounded">
      <div class="d-flex">
        <LoaderContainer :is-loading="isLoading">
          <div slot="on-loading">
            <TableSkeleton :columns="columns" :size="5" paginated />
          </div>
          <DataTable
            :columns.sync="columns"
            :rows="unitActions || []"
            :order-by.sync="orderBy"
            @change-order="changeCellsOrder"
            :page.sync="page"
            :page-limit.sync="pageLimit"
            :total="total || 0"
          ></DataTable>
        </LoaderContainer>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUnitActions2 } from '@/api/unitActions';
import DataTable from '@/components/DataTable/DataTable';
import IdCell from './IdCell';
import StatusCell from './StatusCell';

import LoaderContainer from '@/components/LoaderContainer';
import TableSkeleton from '@/components/ui/skeletons/TableSkeleton';

export default {
  components: {
    DataTable,
    LoaderContainer,
    TableSkeleton,
  },
  data() {
    return {
      isLoading: false,
      unitActions: undefined,
      statuses: ['WAITING, SENT, IN_PROGRESS, OK, KO, REPLAYED, CANCELLED'],
      massActionId: '',
      page: 1,
      pageLimit: 20,
      total: 0,
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actLines.massActionsHistory.columns.unitAction'),
          name: 'id',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actLines.massActionsHistory.columns.massAction'),
          name: 'massAction',
          orderable: false,
          visible: true,
          format: {
            component: IdCell,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actLines.massActionsHistory.columns.actionType'),
          name: 'actionType',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return this.$t('getparc.actTypes.' + row.actionType);
            },
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actLines.massActionsHistory.columns.extraInfo'),
          name: 'extraInfo',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actLines.massActionsHistory.columns.status'),
          name: 'status',
          orderable: false,
          visible: true,
          format: {
            component: StatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.actLines.massActionsHistory.columns.dueDate'),
          name: 'dueDate',
          orderable: false,
          visible: true,
        },
      ],
      orderBy: {
        key: 'ID',
        direction: 'DESC',
      },
    };
  },
  watch: {
    page() {
      this.fetchUnitActs();
    },
    orderBy() {
      this.page = 1;
      this.fetchUnitActs();
    },
    pageLimit() {
      this.page = 1;
      this.fetchUnitActs();
    },
  },
  props: {
    content: Object,
  },
  computed: {
    getPageInfo() {
      return { page: this.page - 1, limit: this.pageLimit };
    },
  },
  methods: {
    async fetchUnitActs(searchFilter = [{ id: 'filters.iccid', value: this.content.iccid }]) {
      this.isLoading = true;
      const response = await fetchUnitActions2(searchFilter, this.getPageInfo, this.orderBy);
      this.unitActions = response.items.map(i => ({ ...i, ...i.unitAction }));

      this.total = response.total;

      this.isLoading = false;
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
  async mounted() {
    this.fetchUnitActs();
  },
};
</script>

<style lang="scss" scoped>
.item {
  p {
    font-size: 0.8rem;
  }
}
</style>
