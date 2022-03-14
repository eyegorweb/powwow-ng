<template>
  <PaginatedDataTable
    storage-id="supervision.table.simdata"
    storage-version="003"
    :columns="columns"
    :fetch-data-fn="getFetchDataFn()"
    :size="7"
    :order="orderBy"
  />
</template>

<script>
import { splittedDataUsage } from '@/api/consumption';
import SplittedDataCol from './SplittedDataCol';
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import get from 'lodash.get';
import StatusCell from './StatusCell';
import LocationCell from './LocationCell';
import OfferCell from './OfferCell';

export default {
  name: 'SplittedSimDataTable',
  props: {
    simcard: Object,
    streamId: Number,
  },
  components: {
    PaginatedDataTable,
  },
  methods: {
    getFetchDataFn() {
      return async (pageInfo) => {
        const response = await splittedDataUsage(this.simcard.id, this.streamId, pageInfo);
        const rows = response.items.map((r) => {
          return { ...r, simcard: this.simcard };
        });
        const total = response.total;

        if (rows.length) {
          if (!this.haveContent) {
            this.haveContent = true;
            this.$emit('haveContent', true);
          }
        }
        return { rows, total };
      };
    },
  },
  watch: {
    streamId() {
      this.$emit('currentFlowTypeChanged', true);
    },
  },
  data() {
    return {
      tableVersion: 0,
      showExtraCells: false,
      orderBy: {
        key: 'date',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.start'
          ),
          name: 'pdpConnectionDateInfo',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'startDate',
          },
        },
        {
          id: 2,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.end'
          ),
          name: 'pdpConnectionDateInfo',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'endDate',
          },
        },
        {
          id: 3,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.status'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: true,
          orderable: false,
          format: {
            component: StatusCell,
          },
        },
        {
          id: 4,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.closing'
          ),
          name: 'pdpConnectionDateInfo',
          visible: false,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'pdpConnectionDateInfo.connectionClosingReasonTranslated');
            },
          },
        },
        {
          id: 5,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.data'
          ),
          name: 'data',
          visible: true,
          orderable: false,
          format: { component: SplittedDataCol },
        },
        {
          id: 6,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'location',
          visible: true,
          orderable: false,
          format: {
            component: LocationCell,
          },
        },
        {
          id: 7,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.apn'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'apn',
          },
        },
        {
          id: 8,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.ip'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: false,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'ipAddressTypeTranslated');
            },
          },
        },
        {
          id: 9,
          label: 'IMEI',
          name: 'splittedPDPConnectionHistory',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'imei',
          },
        },
        {
          id: 10,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.offer'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: false,
          orderable: false,
          format: {
            component: OfferCell,
          },
        },
        {
          id: 11,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'
          ),
          name: 'location',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'cellId',
          },
        },
        {
          id: 12,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.stream'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'stream');
            },
          },
        },
        {
          id: 13,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.contentId'
          ),
          name: 'splittedPDPConnectionHistory',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return get(row, 'contentId');
            },
          },
        },
      ],
      rows: [],
      page: 1,
      pageLimit: 20,
      total: 0,
      haveContent: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
