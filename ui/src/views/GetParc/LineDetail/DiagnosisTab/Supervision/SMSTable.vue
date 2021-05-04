<template>
  <PaginatedDataTable
    storage-id="supervision.table.simsms"
    storage-version="001"
    :columns="columns"
    :fetch-data-fn="getFetchDataFn()"
    :size="7"
    :order="orderBy"
  />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';

import { smsUsage } from '@/api/consumption';

export default {
  name: 'SMSTable',
  props: {
    simcard: Object,
  },
  components: {
    PaginatedDataTable,
  },
  methods: {
    getFetchDataFn() {
      return async (pageInfo) => {
        const response = await smsUsage(this.simcard.id, pageInfo);
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
  data() {
    return {
      showExtraCells: false,
      orderBy: {
        key: 'date',
        direction: 'DESC',
      },
      columns: [
        {
          id: 1,
          label: this.$t('date'),
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'recordOpeningTime',
          },
        },
        {
          id: 2,
          label: 'Entrant/Sortant',
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.smsHistoryData && row.smsHistoryData.incomming ? 'Entrant' : 'Sortant';
            },
          },
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.smsHistoryData && row.smsHistoryData.incomming
                ? row.smsHistoryData.callingNumber
                : row.smsHistoryData.calledNumber;
            },
          },
        },
        {
          id: 4,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'location',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'detail',
          },
        },
        {
          id: 5,
          label: 'PLMN',
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'plmn',
          },
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'imei',
          },
        },
        {
          id: 7,
          label: this.$t('getparc.lineDetail.offer'),
          name: 'offerLabel',
          visible: false,
          orderable: false,
        },
        {
          id: 8,
          label: this.$t('getparc.actLines.col.manufacturer'),
          name: 'simcard',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'deviceInstance.deviceReference',
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
