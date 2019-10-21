<template>
  <PaginatedDataTable :columns="columns" :fetch-data-fn="getFetchDataFn()" :size="7" />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';

import { smsUsage } from '@/api/consumption';
import { col } from '@/components/DataTable/utils';

export default {
  props: {
    simcard: Object,
  },
  components: {
    PaginatedDataTable,
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await smsUsage(this.simcard.id, pageInfo);
        const rows = response.items.map(r => {
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
        col(this.$t('date'), 'smsHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'recordOpeningTime',
        }),
        col('Entrant/Sortant', 'smsHistoryData', true, false, {
          type: 'Getter',
          getter: row => {
            return row.smsHistoryData && row.smsHistoryData.incoming ? 'Entrant' : 'Sortant';
          },
        }),
        col(this.$t('getparc.actDetail.col.msisdn'), 'smsHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'callingNumber',
        }),
        col(
          this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          'location',
          true,
          false,
          {
            type: 'ObjectAttribute',
            path: 'detail',
          }
        ),
        col('PLMN', 'smsHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'plmn',
        }),
        col(this.$t('getparc.actDetail.col.imei'), 'smsHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'imei',
        }),
        col(this.$t('getparc.lineDetail.offer'), 'smsHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'offerCode',
        }),
        /*
        col(this.$t('getparc.actDetail.col.commercialRef'), 'simcard', false, false, {
          type: 'ObjectAttribute',
          path: 'order.id',
        }),
        //*/
        col(this.$t('getparc.actLines.col.manufacturer'), 'simcard', false, false, {
          type: 'ObjectAttribute',
          path: 'deviceInstance.deviceReference',
        }),
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
