<template>
  <PaginatedDataTable :columns="columns" :fetch-data-fn="getFetchDataFn()" :size="7" />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';

import { voiceUsage } from '@/api/consumption';
import { col } from '@/components/DataTable/utils';
import { formattedValueFromSeconds } from '@/api/utils';

export default {
  name: 'VoiceTable',
  props: {
    simcard: Object,
  },
  components: {
    PaginatedDataTable,
  },
  methods: {
    getFetchDataFn() {
      return async pageInfo => {
        const response = await voiceUsage(this.simcard.id, pageInfo);
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
        col('Date de l’appel', 'voiceHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'recordOpeningTime',
        }),
        col('Durée', 'voiceHistoryData', true, false, {
          type: 'Getter',
          getter: row => {
            return row.voiceHistoryData && row.voiceHistoryData.duration
              ? formattedValueFromSeconds(row.voiceHistoryData.duration)
              : '-';
          },
        }),
        col('Type', 'voiceHistoryData', true, false, {
          type: 'ObjectAttribute',
          path: 'usageType',
        }),
        col('Entrant/Sortant', 'smsHistoryData', true, false, {
          type: 'Getter',
          getter: row => {
            return row.voiceHistoryData && row.voiceHistoryData.incomming ? 'Entrant' : 'Sortant';
          },
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
        col('Détail usage', 'detailsTranslated', false, false),
        col('MSISDN du correspondant', 'voiceHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'callingNumber',
        }),
        col('ID de la cellule', 'voiceHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'cellId',
        }),
        col('PLMN', 'voiceHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'plmn',
        }),
        col(this.$t('getparc.actDetail.col.imei'), 'voiceHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'imei',
        }),
        col(this.$t('getparc.lineDetail.offer'), 'voiceHistoryData', false, false, {
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
