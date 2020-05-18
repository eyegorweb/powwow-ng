<template>
  <ConsumptionTable :columns.sync="columns" :fetch-data-fn="getFetchDataFn()" />
</template>

<script>
import ConsumptionTable from './ConsumptionTable';
import { voiceUsage } from '@/api/consumption';
import { col } from '@/components/DataTable/utils';
import { formattedValueFromSeconds } from '@/api/utils';

export default {
  props: {
    simcard: Object,
  },
  components: {
    ConsumptionTable,
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
            return row.voiceHistoryData && row.voiceHistoryData.incoming ? 'Entrant' : 'Sortant';
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
        col('Détail usage', 'voiceHistoryData', false, false, {
          type: 'ObjectAttribute',
          path: 'details',
        }),
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
