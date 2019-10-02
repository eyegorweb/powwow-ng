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
import get from 'lodash.get';
import moment from 'moment';

export default {
  components: {
    DataTable,
  },
  props: {
    content: Object,
  },
  mounted() {
    const getPeriod = (min, max) => {
      if (min && max) {
        return this.$t('getsim.between-min-max', {
          min,
          max,
        });
      }

      if (min) {
        return this.$t('getsim.date-since', { startDate: min });
      }
    };

    const rows = [
      {
        imei: get(this.content, 'deviceInstance.imei', ''),
        model: get(this.content, 'deviceInstance.deviceReference', ''),
        manufacturer: get(this.content, 'deviceInstance.manufacturer', ''),
        macAdress: get(this.content, 'deviceInstance.mac', ''),
        usagePeriod: getPeriod(
          get(this.content, 'deviceInstance.auditable.updated'),
          moment().format('DD-MM-YYYY')
        ),
      },
    ];

    if (get(this.content, 'deviceInstance.imeiPrevious')) {
      rows.push({
        imei: get(this.content, 'deviceInstance.imeiPrevious', ''),
        model: get(this.content, 'deviceInstance.deviceReferencePrevious', ''),
        manufacturer: get(this.content, 'deviceInstance.manufacturerPrevious', ''),
        macAdress: get(this.content, 'deviceInstance.macPrevious', ''),
        usagePeriod: getPeriod(
          get(this.content, 'deviceInstance.auditable.created'),
          get(this.content, 'deviceInstance.auditable.updated')
        ),
      });
    }
    this.rows = rows;
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
      rows: [],
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
