<template>
  <PaginatedDataTable
    storage-id="supervision.table.simvoice"
    storage-version="001"
    :columns="columns"
    :fetch-data-fn="getFetchDataFn()"
    :size="7"
    :order="orderBy"
  />
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';

import { voiceUsage } from '@/api/consumption';
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
      return async (pageInfo) => {
        const response = await voiceUsage(this.simcard.id, pageInfo);
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
          label: 'Date de l’appel',
          name: 'voiceHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'recordOpeningTime',
          },
        },
        {
          id: 2,
          label: 'Durée',
          name: 'voiceHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.voiceHistoryData && row.voiceHistoryData.duration
                ? formattedValueFromSeconds(row.voiceHistoryData.duration)
                : '-';
            },
          },
        },
        {
          id: 3,
          label: 'Type',
          name: 'voiceHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'usageType',
          },
        },
        {
          id: 4,
          label: 'Entrant/Sortant',
          name: 'smsHistoryData',
          visible: true,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.voiceHistoryData && row.voiceHistoryData.incomming ? 'Entrant' : 'Sortant';
            },
          },
        },
        {
          id: 5,
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.location'
          ),
          name: 'location',
          visible: true,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'detailTranslated',
          },
        },
        {
          id: 6,
          label: 'Détail usage',
          name: 'detailsTranslated',
          visible: false,
          orderable: false,
        },
        {
          id: 7,
          label: 'MSISDN du correspondant',
          name: 'voiceHistoryData',
          visible: false,
          orderable: false,
          format: {
            type: 'Getter',
            getter: (row) => {
              return row.voiceHistoryData && row.voiceHistoryData.incomming
                ? row.voiceHistoryData.callingNumber
                : row.voiceHistoryData.calledNumber;
            },
          },
        },
        {
          id: 8,
          label: 'ID de la cellule',
          name: 'voiceHistoryData',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'cellId',
          },
        },
        {
          id: 9,
          label: 'PLMN',
          name: 'voiceHistoryData',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'plmn',
          },
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'voiceHistoryData',
          visible: false,
          orderable: false,
          format: {
            type: 'ObjectAttribute',
            path: 'imei',
          },
        },
        {
          id: 11,
          label: this.$t('getparc.lineDetail.offer'),
          name: 'offerLabel',
          visible: false,
          orderable: false,
        },
        {
          id: 12,
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
