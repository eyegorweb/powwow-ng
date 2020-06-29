<template>
  <div>
    <PaginatedDataTable
      :key="version"
      :columns="columns"
      :fetch-data-fn="fetchDataFn()"
      :size="7"
      :order="orderBy"
    >
      <template slot="topLeftCorner">
        <UiButton variant="outline-primary" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          Vue carte
        </UiButton>
      </template>
      <template slot="noResult">
        <UiButton variant="outline-primary" @click="$emit('gotomap')">
          <i class="ic-Pin-Icon"></i>
          Vue carte
        </UiButton>

        <div class="mt-2 alert alert-light m-0" role="alert">
          {{ $t('noResult') }}
        </div>
      </template>
    </PaginatedDataTable>
  </div>
</template>

<script>
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import uuid from 'uuid/v1';
import UiButton from '@/components/ui/Button';

export default {
  components: {
    PaginatedDataTable,
    UiButton,
  },

  props: {
    refreshLinesFn: Function,
    total: Number,
  },

  data() {
    return {
      version: 0,
      rows: undefined,
      columns: [
        {
          id: uuid(),
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          sortingName: 'msisdn',
          visible: true,
          noHandle: true,
        },
        {
          id: uuid(),
          label: this.$t('getparc.actDetail.col.iccid'),
          orderable: true,
          visible: true,
          name: 'iccid',
        },
        {
          id: uuid(),
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.operator'
          ),
          orderable: true,
          visible: true,
          name: 'operatorRealPlmn',
          sortingName: 'plmn',
        },
        {
          id: uuid(),
          label: this.$t('filters.country'),
          orderable: true,
          visible: true,
          name: 'country',
          sortingName: 'countryName',
          format: {
            type: 'Getter',
            getter: row => {
              return row.countryName || row.countryNameFr;
            },
          },
        },
        {
          id: uuid(),
          label: this.$t('filters.postalCode'),
          orderable: true,
          visible: true,
          name: 'zipCode',
          sortingName: 'zipcode'
        },
        {
          id: uuid(),
          label: this.$t('filters.city'),
          orderable: true,
          visible: false,
          name: 'city',
        },
        {
          id: uuid(),
          label: this.$t('filters.lastUsage'),
          orderable: true,
          visible: false,
          name: 'lastUsageDate',
          sortingName: 'lastUsageDate'

        },

        {
          id: uuid(),
          label: this.$t('getparc.actDetail.col.imsi'),
          orderable: true,
          visible: false,
          name: 'imsi',
          sortingName: 'imsi'
        },
        {
          id: uuid(),
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.plmn'
          ),
          orderable: true,
          visible: false,
          name: 'plmn',
          sortingName: 'plmn'
        },
        {
          id: uuid(),
          label: this.$t(
            'getparc.lineDetail.tab2.supervisionContent.dataConsumptionPerDayColumns.cellId'
          ),
          orderable: true,
          visible: false,
          name: 'cellid',
          sortingName: 'cellid'
        },
        {
          id: uuid(),
          label: this.$t('filters.usageType'),
          orderable: true,
          visible: false,
          name: 'lastUsageType',
          sortingName: 'lastUsageType'
        },
        {
          id: uuid(),
          label: this.$t('filters.direction'),
          orderable: true,
          visible: false,
          name: 'usageDetails',
        },
        {
          id: uuid(),
          label: this.$t('filters.pdpStatus'),
          orderable: true,
          visible: false,
          name: 'lastPdpConStatus',
          sortingName: 'lastPdpConStatus'
        },
        {
          id: uuid(),
          label: this.$t('filters.actDateStart'),
          orderable: true,
          visible: false,
          name: 'lastPdpConStartDate',
          sortingName: 'lastPdpConStartDate'
        },
        {
          id: uuid(),
          label: this.$t('filters.actDateEnd'),
          orderable: true,
          visible: false,
          name: 'lastPdpConEndDate',
          sortingName: 'lastPdpConEndDate'
        },
        {
          id: uuid(),
          label: this.$t('getparc.actDetail.col.imei'),
          orderable: true,
          visible: false,
          name: 'imei',
          sortingName: 'imei'
        },
        {
          id: uuid(),
          label: this.$t('getadmin.partnerDetail.contactDetail'),
          orderable: true,
          visible: false,
          name: 'todo',
        },
        {
          id: uuid(),
          label: this.$t('filters.lines.networkStatus'),
          orderable: true,
          visible: false,
          name: 'networkStatus',
          sortingName: 'networkStatus',
        },
        {
          id: uuid(),
          label: this.$t('col.offer'),
          orderable: true,
          visible: false,
          name: 'offer',
        },
        {
          id: uuid(),
          label: this.$t('col.partner'),
          orderable: true,
          visible: false,
          name: 'partyName',
        },
      ],
      currentPage: 1,
      orderBy: { key: 'lastUsageDate', direction: 'ASC' },
    };
  },

  watch: {
    fetchDataFn() {
      this.version += 1;
    },
  },

  methods: {
    fetchDataFn() {
      return async (pageInfo, orderBy) => {
        const sorting = {};
        sorting[orderBy.key] = orderBy.direction;
        const rows = await this.refreshLinesFn(pageInfo, sorting);
        return {
          rows,
          total: this.total || 0,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
