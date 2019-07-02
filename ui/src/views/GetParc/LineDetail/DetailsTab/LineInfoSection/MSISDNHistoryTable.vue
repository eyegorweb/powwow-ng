<template>
  <DataTable
    :columns.sync="columns"
    :rows="rows || []"
    :order-by.sync="orderBy"
    @change-order="changeCellsOrder"
  >
  </DataTable>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';

export default {
  components: {
    DataTable,
  },
  data() {
    return {
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'msisdnA',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('col.status'),
          name: 'status',
          orderable: false,
          visible: true,
        },
      ],
      rows: [
        {
          msisdn: '123123123123',
          msisdnA: '123123123123',
          imsi: '123123123',
          status: 'Activé',
        },
      ],
      orderBy: {
        key: 'msisdn',
        direction: 'DESC',
      },
    };
  },
  methods: {
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter(c => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
};
</script>

<style lang="scss" scoped></style>
