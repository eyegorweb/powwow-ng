<template>
  <div>
    <draggable handle=".handle">
      <transition-group>
        <ContentBlock :key="'block1'">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab2.networkHistoryContent.lastPLMN') }}
          </template>
          <template v-if="!noResults.lastVisitedCountries" slot="topRight">
            <ExportButton :export-fn="getExportForLastVisitedCountries()">
              <span slot="title">
                {{ $t('getparc.lineDetail.tab2.networkHistoryContent.exportLastPLMN') }}
              </span>
            </ExportButton>
          </template>
          <template slot="content">
            <div v-if="noResults.lastVisitedCountries">{{ $t('noConso') }}</div>
            <div v-else>
              <PaginatedDataTable
                :key="tableVersion"
                :columns="columnsForLastVisitedCountries"
                :fetch-data-fn="fetchDataLastVisitedCountries()"
                :size="6"
              />
            </div>
          </template>
        </ContentBlock>
        <ContentBlock :key="'block2'" v-if="!partnerTypeMVNO">
          <template slot="title">
            {{ $t('getparc.lineDetail.tab2.networkHistoryContent.cellsConsumption') }}
          </template>
          <template v-if="!noResults.cellsConsumption" slot="topRight">
            <ExportButton :export-fn="getExportForCellsConsumption()">
              <span slot="title">
                {{ $t('getparc.lineDetail.tab2.networkHistoryContent.exportCellsConsumption') }}
              </span>
            </ExportButton>
          </template>
          <template slot="content">
            <div v-if="noResults.cellsConsumption">{{ $t('noConso') }}</div>
            <div v-else>
              <PaginatedDataTable
                :key="tableVersion"
                :columns="columnsForCellsConsumption"
                :fetch-data-fn="fetchDataCellsConsumption()"
                :size="5"
                :order="orderByForCellsHistory"
              />
            </div>
          </template>
        </ContentBlock>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ContentBlock from '@/views/GetParc/LineDetail/ContentBlock';
import ExportButton from '@/components/ExportButton';
import {
  fetchLastVisitedCountries,
  fetchCellsHistoryConsumption,
  exportLastVisitedCountries,
  exportCellsHistory,
} from '@/api/consumption';
import PaginatedDataTable from '@/components/DataTable/PaginatedDataTable';
import { col } from '@/components/DataTable/utils';
import get from 'lodash.get';

export default {
  components: {
    draggable,
    ContentBlock,
    ExportButton,
    PaginatedDataTable,
  },

  props: {
    content: Object,
  },

  data() {
    return {
      networkHistoryInfo: undefined,
      tableVersion: 0,
      columnsForLastVisitedCountries: [
        col('Pays', 'countryName', true, true),
        col('Opérateur', 'operator', true, true),
        col('PLMN', 'PLMN', true, true),
        col('Date de changement de PLMN', 'visitDate', true, true),
        col('Type', 'type', true, true),
        col('Usage', 'usage', true, true),
      ],
      columnsForCellsConsumption: [
        col('ID de la cellule', 'cellId', true, true),
        col('Date de changement', 'cellChangeDate', true, true),
        col('Opérateur', 'operator', true, true),
        col('PLMN', 'PLMN', true, true),
        col('Code postal', 'zipCode', true, true),
        col('Ville', 'city', false, true),
        col('Longitude', 'longitude', false, true),
        col('Latitude', 'latitude', false, true),
      ],
      noResults: {
        lastVisitedCountries: false,
        cellsConsumption: false,
      },
      orderByForCellsHistory: { key: 'cellChangeDate', direction: 'DESC' },
      orderByForLastVisitedCountries: { key: 'visitDate', direction: 'DESC' },
    };
  },

  computed: {
    partnerTypeMVNO() {
      const typeForPartner = get(this.content, 'party.partyType');
      let isMVNOPartner;
      if (typeForPartner === 'MVNO') {
        isMVNOPartner = true;
      } else {
        isMVNOPartner = false;
      }
      return isMVNOPartner;
    },
  },

  methods: {
    getExportForLastVisitedCountries() {
      return async (columns, orderBy, exportFormat) => {
        return await exportLastVisitedCountries(this.content.accessPoint.id, exportFormat);
      };
    },
    getExportForCellsConsumption() {
      return async (columns, orderBy, exportFormat) => {
        return await exportCellsHistory(this.content.accessPoint.id, exportFormat);
      };
    },
    fetchDataLastVisitedCountries() {
      return async pageInfo => {
        const response = await fetchLastVisitedCountries(this.content.accessPoint.id, pageInfo);
        if (!response || !response.length) this.noResults.lastVisitedCountries = true;
        return {
          rows: response,
        };
      };
    },
    fetchDataCellsConsumption() {
      return async (pageInfo, orderBy) => {
        const response = await fetchCellsHistoryConsumption(
          this.content.accessPoint.id,
          pageInfo,
          orderBy
        );
        if (!response || !response.total) this.noResults.cellsConsumption = true;
        return {
          rows: response.items,
          total: response.total,
        };
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
