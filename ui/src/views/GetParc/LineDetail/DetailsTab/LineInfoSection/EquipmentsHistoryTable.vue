<template>
  <Fragment>
    <DataTable
      v-if="columns"
      :columns.sync="columns"
      :rows="rows || []"
      :order-by.sync="orderBy"
      @change-order="changeCellsOrder"
    ></DataTable>
  </Fragment>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import get from 'lodash.get';
import { Fragment } from 'vue-fragment';

export default {
  components: {
    DataTable,
    Fragment,
  },
  props: {
    content: Object,
  },
  mounted() {
    this.prepareRows();
    this.prepareColumns();
  },
  data() {
    return {
      columns: undefined,
      rows: [],
      orderBy: {
        key: 'msisdn',
        direction: 'DESC',
      },
    };
  },
  methods: {
    prepareRows() {
      const getPeriod = (current, previous, date) => {
        if (current && previous) {
          return this.$t('getsim.date-until', {
            endDate: date,
          });
        }

        if (current && date) {
          return this.$t('getsim.date-since', { startDate: date });
        }
      };

      const rows = [];

      const haveRow1 = [
        'deviceInstance.imei',
        'deviceInstance.deviceReference',
        'deviceInstance.manufacturer',
        'deviceInstance.mac',
        'deviceInstance.imeiChangeDate',
      ].filter((key) => get(this.content, key)).length;

      if (haveRow1) {
        rows.push({
          imei: get(this.content, 'deviceInstance.imei', ''),
          model: get(this.content, 'deviceInstance.deviceReference', ''),
          manufacturer: get(this.content, 'deviceInstance.manufacturer', ''),
          macAdress: get(this.content, 'deviceInstance.mac', ''),
          usagePeriod: getPeriod(
            get(this.content, 'deviceInstance.imei'),
            undefined,
            get(this.content, 'deviceInstance.imeiChangeDate')
          ),
        });
      }

      if (get(this.content, 'deviceInstance.imeiPrevious')) {
        const haveRow2 = [
          'deviceInstance.imeiPrevious',
          'deviceInstance.deviceReferencePrevious',
          'deviceInstance.manufacturerPrevious',
          'deviceInstance.macPrevious',
          'deviceInstance.imeiChangeDate',
        ].filter((key) => get(this.content, key)).length;
        if (haveRow2) {
          rows.push({
            imei: get(this.content, 'deviceInstance.imeiPrevious', ''),
            model: get(this.content, 'deviceInstance.deviceReferencePrevious', ''),
            manufacturer: get(this.content, 'deviceInstance.manufacturerPrevious', ''),
            macAdress: get(this.content, 'deviceInstance.macPrevious', ''),
            usagePeriod: getPeriod(
              get(this.content, 'deviceInstance.imei'),
              get(this.content, 'deviceInstance.imeiPrevious'),
              get(this.content, 'deviceInstance.imeiChangeDate')
            ),
          });
        }
      }
      this.rows = rows;
    },
    prepareColumns() {
      const mvnoColumns = [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: false,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.lineDetail.tab1.macAdress'),
          name: 'macAdress',
          orderable: false,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.lineDetail.tab1.usagePeriod'),
          name: 'usagePeriod',
          orderable: false,
          visible: true,
        },
      ];
      const otherColumns = [
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
          id: 3,
          label: this.$t('getparc.lineDetail.manufacturer'),
          name: 'manufacturer',
          orderable: false,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.lineDetail.tab1.macAdress'),
          name: 'macAdress',
          orderable: false,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.lineDetail.tab1.usagePeriod'),
          name: 'usagePeriod',
          orderable: false,
          visible: true,
        },
      ];

      if (this.$loGet(this.content, 'party.partyType') === 'MVNO') {
        this.columns = mvnoColumns;
      } else {
        this.columns = otherColumns;
      }
    },
    changeCellsOrder(orderedCells) {
      const notVisibleCells = this.columns.filter((c) => !c.visible);
      this.columns = orderedCells.concat(notVisibleCells);
    },
  },
};
</script>

<style lang="scss" scoped></style>
