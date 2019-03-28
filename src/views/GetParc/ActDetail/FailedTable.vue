<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $t('getparc.actDetail.title', { total: total }) }}
          </h2>
        </div>
      </div>
      <DataTable
        :columns.sync="columns"
        :rows="rows || []"
        :page.sync="page"
        :page-limit.sync="pageLimit"
        :total="total || 0"
        :order-by.sync="orderBy"
        :show-extra-columns.sync="showExtraCells"
        @change-order="changeCellsOrder"
        :size="7"
      >
        <template slot="topLeftCorner">
          search input
        </template>
      </DataTable>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';

export default {
  components: {
    DataTable,
    LoaderContainer,
  },
  props: {
    rows: {
      type: Array,
    },
    total: Number,
  },
  data() {
    return {
      columns: [
        {
          id: 1,
          label: this.$t('getparc.actDetail.col.id'),
          name: 'id',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
        },
        {
          id: 2,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'actState',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.failDate'),
          name: 'failDate',
          orderable: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getparc.actDetail.col.failReason'),
          name: 'failReason',
          orderable: true,
          visible: true,
        },
        {
          id: 5,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: false,
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'constructor',
          orderable: true,
          visible: false,
        },
        {
          id: 9,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'commercialRef',
          orderable: true,
          visible: false,
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.imei'),
          name: 'imei',
          orderable: true,
          visible: false,
        },
      ],
      page: 0,
      pageLimit: 20,
      orderBy: {
        key: 'id',
        direction: 'DESC',
      },
      showExtraCells: false,
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

<style scoped></style>
