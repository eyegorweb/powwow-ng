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
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.lineDetail.model'),
          name: 'model',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.lineDetail.manufacturer'),
          name: 'manufacturer',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.lineDetail.tab1.macAdress'),
          name: 'macAdress',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.lineDetail.tab1.usagePeriod'),
          name: 'usagePeriod',
          orderable: false,
          visible: true,
        },
      ],
      rows: [
        {
          imei: '123123123123',
          model: 'Cinterion BFS4-V',
          manufacturer: 'Gemalto GbmH',
          macAdress: '46:09:d4:e6:99:a1',
          usagePeriod: 'du 15/11/2016 au 26/09/2017',
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
