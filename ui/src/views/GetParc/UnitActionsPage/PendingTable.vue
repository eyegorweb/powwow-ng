<template>
  <UnitActsTable
    storage-id="unitacts.pending"
    storage-version="001"
    grouped-status="PENDING"
    :mass-action-id="massActionId"
    :total.sync="total"
    :columns="columns"
  />
</template>

<script>
import UnitActsTable from './UnitActsTable';
import StatusCell from '@/views/GetParc/LineDetail/DetailsTab/ActsHistory/StatusCell';

export default {
  components: {
    UnitActsTable,
  },
  props: {
    total: Number,
  },
  data() {
    return {
      massActionId: parseInt(this.$route.params.massActionId),
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.details'),
          name: 'info',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
          exportId: 'MSISDN',
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
          exportId: 'ICCID',
        },

        {
          id: 5,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'status',
          orderable: true,
          visible: true,
          exportId: 'UNIT_ACTION_STATUS',
          format: {
            component: StatusCell,
          },
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.startDate'),
          name: 'dueDate',
          orderable: true,
          visible: true,
          // exportId: 'UNKNOWN',
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
          // exportId: 'UNKNOWN',
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'deviceManufacturer',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_MANUFACTURER',
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
          exportId: 'DEVICE_REFERENCE',
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
          exportId: 'IMEI',
        },
        {
          id: 12,
          label: this.$t('getparc.actDetail.col.statusDate'),
          name: 'unitAction',
          format: {
            type: 'ObjectAttribute',
            path: 'statusDate',
          },
          orderable: true,
          visible: false,
          exportId: 'UNIT_ACTION_STATUS_DATE',
        },
        {
          id: 13,
          label: this.$t('getparc.actDetail.col.creationDate'),
          orderable: true,
          visible: false,
          name: 'unitAction',
          format: {
            type: 'ObjectAttribute',
            path: 'created',
          },
          exportId: 'UNIT_ACTION_CREATED_DATE',
        },
        {
          id: 14,
          label: this.$t('type'),
          orderable: true,
          visible: false,
          name: 'type',
          exportId: 'UNIT_ACTION_TYPE',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
