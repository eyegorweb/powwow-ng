<template>
  <LoaderContainer :is-loading="false">
    <div>
      <div class="row mb-3">
        <div class="col">
          <h2 v-if="total === 0" class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $tc('getparc.actDetail.title', 0) }}
          </h2>
          <h2 v-if="total === 1" class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $tc('getparc.actDetail.title', 1) }}
          </h2>
          <h2 v-if="total > 1" class="text-gray font-weight-light" style="font-size: 2rem">
            {{ $tc('getparc.actDetail.title', total, { total: total }) }}
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
          <SearchByActId />
        </template>
      </DataTable>
    </div>
  </LoaderContainer>
</template>

<script>
import DataTable from '@/components/DataTable/DataTable';
import LoaderContainer from '@/components/LoaderContainer';
import SearchByActId from '@/views/GetParc/SearchByActId';

export default {
  components: {
    DataTable,
    LoaderContainer,
    SearchByActId,
  },
  props: {
    massActionId: String,
    rows: Array,
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
          id: 2,
          label: this.$t('getparc.actDetail.col.msisdn'),
          name: 'msisdn',
          orderable: true,
          visible: true,
        },
        {
          id: 3,
          label: this.$t('getparc.actDetail.col.iccid'),
          name: 'iccid',
          orderable: true,
          visible: true,
        },
        {
          id: 4,
          label: this.$t('getparc.actDetail.col.actState'),
          name: 'statusDate',
          orderable: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.actDetail.col.startDate'),
          name: 'dueDate',
          orderable: true,
          visible: true,
        },
        {
          id: 8,
          label: this.$t('getparc.actDetail.col.imsi'),
          name: 'imsi',
          orderable: true,
          visible: true,
        },
        {
          id: 10,
          label: this.$t('getparc.actDetail.col.constructor'),
          name: 'manufacturer',
          orderable: true,
          visible: false,
        },
        {
          id: 11,
          label: this.$t('getparc.actDetail.col.commercialRef'),
          name: 'deviceReference',
          orderable: true,
          visible: false,
        },
        {
          id: 12,
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
