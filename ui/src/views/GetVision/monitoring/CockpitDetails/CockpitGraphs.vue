<template>
  <div>
    <div class="row">
      <div class="col-2">
        <slot />
      </div>
      <div class="col-10 d-flex justify-content-between">
        <Toggle
          v-if="toggleValues"
          @update="supervisionType = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
        <ExportButton :export-fn="getExportFn()">
          <span slot="title">{{ $t('getvsion.exportGraph') }}</span>
        </ExportButton>
      </div>
    </div>

    <div class="mt-2">
      <div :key="supervisionType">
        <CockpitDataGraph :supervision-type="supervisionType" :filters="formatFilters" />

        <CockpitSmsGraph :supervision-type="supervisionType" :filters="formatFilters" />

        <CockpitVoiceGraph :supervision-type="supervisionType" :filters="formatFilters" />
      </div>
    </div>
  </div>
</template>

<script>
import Toggle from '@/components/ui/UiToggle2';
import CockpitDataGraph from './CockpitDataGraph';
import CockpitSmsGraph from './CockpitSmsGraph';
import CockpitVoiceGraph from './CockpitVoiceGraph';
import ExportButton from '@/components/ExportButton';

import { supervisionExport } from '@/api/supervision.js';

export default {
  components: {
    Toggle,
    CockpitDataGraph,
    CockpitSmsGraph,
    CockpitVoiceGraph,
    ExportButton,
  },
  props: {
    markerData: Object,
    appliedFilters: Array,
  },
  data() {
    return {
      columns: [],
      orderBy: undefined,
      supervisionType: 'INTRA_DAY',
      toggleValues: [
        {
          id: 'INTRA_DAY',
          label: 'getvsion.supervisionTypes.INTRA_DAY',
          default: true,
        },
        {
          id: 'INTRADAY_CUMUL',
          label: 'getvsion.supervisionTypes.INTRADAY_CUMUL',
        },
        {
          id: 'DAY',
          label: 'getvsion.supervisionTypes.DAY',
        },
        {
          id: 'MONTH',
          label: 'getvsion.supervisionTypes.MONTH',
        },
      ],
    };
  },

  computed: {
    partnerId() {
      if (this.appliedFilters) {
        const partnerFilter = this.appliedFilters.find(
          f => f.id === 'getadmin.users.filters.partners'
        );
        if (partnerFilter) {
          return partnerFilter.data.id;
        }
      }
      return undefined;
    },
    formatFilters() {
      if (!this.appliedFilters) return {};

      return this.appliedFilters.reduce(
        (filters, item) => {
          if (item.id === 'getadmin.users.filters.partners') {
            filters.params.partyIds = [item.data.id];
          }

          if (item.id === 'filters.country') {
            filters.params.locationCode = item.data.codeIso3;
          }

          if (item.id === 'common.period') {
            filters.beginDate = item.data.startDate;
            filters.endDate = item.data.endDate;
          }

          return filters;
        },
        { params: {} }
      );
    },
  },

  methods: {
    getExportFn() {
      return async (columnsParam, orderBy, exportFormat) => {
        const countryFilter = this.appliedFilters.find(c => c.id === 'filters.country');
        let locationCode;

        if (countryFilter && countryFilter.data) {
          locationCode = countryFilter.data.codeIso3;
        }
        const queryParams = {
          supervisionType: this.supervisionType,
          params: {},
          columns: [
            'DATE',
            'DATA_IN',
            'DATA_OUT',
            'DATA_TOTAL',
            'DATA_NUMBER_CONNECTIONS',
            'DATA_NUMBER_LINES',
            'SMS_IN',
            'SMS_OUT',
            'SMS_TOTAL',
            'SMS_NUMBER_LINES',
            'VOICE_CALL_NUMBER_IN',
            'VOICE_CALL_NUMBER_OUT',
            'VOICE_CALL_NUMBER_TOTAL',
            'VOICE_AMOUNT_IN',
            'VOICE_AMOUNT_OUT',
            'VOICE_AMOUNT',
            'VOICE_NUMBER_LINES',
          ],
          exportFormat,
        };

        if (locationCode) {
          queryParams.params.locationCode = locationCode;
        }

        return await supervisionExport(queryParams);
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
