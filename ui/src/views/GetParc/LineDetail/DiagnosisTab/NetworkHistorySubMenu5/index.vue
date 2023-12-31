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
            <div v-if="noResults.lastVisitedCountries" class="alert-light">{{ $t('noConso') }}</div>
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
        <ContentBlock
          :key="'block2'"
          v-if="!partnerTypeMVNO && havePermission('getVision', 'read')"
        >
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
            <div v-if="noResults.cellsConsumption" class="alert-light">{{ $t('noConso') }}</div>
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
import { mapGetters } from 'vuex';

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
        col(1, 'Pays', 'countryName', true, true),
        col(2, 'Opérateur', 'operator', true, true),
        col(3, 'PLMN', 'PLMN', true, true),
        col(4, 'Date de changement de PLMN', 'visitDate', true, true),
        col(5, 'Type', 'type', true, true),
        col(6, 'Usage', 'usage', true, true),
      ],
      columnsForCellsConsumption: [
        col(1, 'ID de la cellule', 'cellId', true, true),
        col(2, 'Date de changement', 'cellChangeDate', true, true),
        col(3, 'Opérateur', 'operator', true, true),
        col(4, 'PLMN', 'PLMN', true, true),
        col(5, 'Code postal', 'zipCode', true, true),
        col(6, 'Ville', 'city', false, true),
        col(7, 'Longitude', 'longitude', false, true),
        col(8, 'Latitude', 'latitude', false, true),
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
    ...mapGetters(['havePermission']),

    partnerTypeMVNO() {
      return get(this.content, 'party.partyType') === 'MVNO';
    },
  },

  methods: {
    getExportForLastVisitedCountries() {
      return async (columns, orderBy, exportFormat) => {
        return exportLastVisitedCountries(this.content.accessPoint.id, exportFormat);
      };
    },
    getExportForCellsConsumption() {
      return async (columns, orderBy, exportFormat) => {
        return exportCellsHistory(this.content.accessPoint.id, exportFormat);
      };
    },
    fetchDataLastVisitedCountries() {
      return async (pageInfo) => {
        const response = await fetchLastVisitedCountries(this.content.accessPoint.id, pageInfo);
        if (response && response.total > 0) {
          this.noResults.lastVisitedCountries = false;
        } else {
          this.noResults.lastVisitedCountries = true;
        }
        return {
          rows: response.items,
          total: response.total,
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

        if (response && response.total > 0) {
          this.noResults.cellsConsumption = false;
        } else {
          this.noResults.cellsConsumption = true;
        }
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
