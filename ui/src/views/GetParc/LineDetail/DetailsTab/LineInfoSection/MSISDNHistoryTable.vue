<template>
  <DataTable
    :columns.sync="columns"
    :rows="rows || []"
    :order-by.sync="orderBy"
    @change-order="changeCellsOrder"
  ></DataTable>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';

export default {
  components: {
    DataTable,
  },
  props: {
    lines: Array,
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
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'msisdn', '-');
            },
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actLines.col.msisdnA'),
          name: 'msisdnA',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'msisdnA', '-');
            },
          },
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'imsi', '-');
            },
          },
        },
        {
          id: 3,
          label: this.$t('col.status'),
          name: 'status',
          orderable: false,
          visible: true,
          format: {
            type: 'Getter',
            getter: (row) => {
              return this.$loGet(row, 'status', '-');
            },
          },
        },
      ],
      rows: [],
      orderBy: {
        key: 'msisdn',
        direction: 'DESC',
      },
    };
  },
  methods: {
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter((c) => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
    refreshTable() {
      this.rows = this.lines
        .map((l) => ({
          id: l.id,
          msisdn: l.msisdn,
          imsi: l.imsi,
          status: l.statusTranslated,
          msisdnA: l.msisdnA,
        }))
        .sort((a, b) => (a.id > b.id ? -1 : 1));
    },
  },
  watch: {
    lines() {
      this.refreshTable();
    },
  },
  mounted() {
    this.refreshTable();
  },
};
</script>

<style lang="scss" scoped></style>
