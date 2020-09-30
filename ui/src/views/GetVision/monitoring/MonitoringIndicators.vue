<template>
  <div class="mb-3">
    <Indicators
      :key="version"
      v-if="currentIndicators"
      :meta="currentIndicators"
      :can-refresh="canRefresh"
      :on-click="onIndicatorClick"
    />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';
import {
  globalActifParc,
  linesWithoutTraffic,
  linesWIthoutTraffic30Days,
  linesNonLocalizedTraffic,
  fetchIndicator,
  fetchCockpitIndicator,
} from '@/api/supervision.js';

export default {
  components: {
    Indicators,
  },
  props: {
    usage: String,
    canRefresh: Boolean,
    appliedFilters: Array,
  },

  watch: {
    appliedFilters() {
      this.version += 1;
    },

    usage() {
      this.version += 1;
    },
  },

  data() {
    return {
      version: 0,
      allUsageIndicators: [
        {
          name: 'globalActif',
          labelKey: 'getvsion.indicators.globalActif',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: await globalActifParc(this.formatFilters()) };
          },
          counter: 'COUNTER1',
        },
        {
          name: 'lineWithoutTraffic',
          labelKey: 'getvsion.indicators.lineWithoutTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: await linesWithoutTraffic(this.formatFilters()) };
          },
          counter: 'COUNTER2',
        },
        {
          name: 'linesWIthoutTraffic30Days',
          labelKey: 'getvsion.indicators.linesWIthoutTraffic30Days',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: await linesWIthoutTraffic30Days(this.formatFilters()) };
          },
          counter: 'COUNTER3',
        },
        {
          name: 'linesNonLocalizedTraffic',
          labelKey: 'getvsion.indicators.linesNonLocalizedTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: await linesNonLocalizedTraffic(this.formatFilters()) };
          },
          counter: 'COUNTER4',
        },
      ],

      dataUsageIndicators: [
        {
          name: 'globalActif',
          labelKey: 'getvsion.indicators.globalActif',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await globalActifParc(this.formatFilters()) };
          },
          counter: 'COUNTER1',
        },
        {
          name: 'linesNeverOpenedDataSession',
          labelKey: 'getvsion.indicators.linesNeverOpenedDataSession',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchIndicator('COUNTER2', 'DATA', this.formatFilters()) };
          },
          counter: 'COUNTER2',
        },
        {
          name: 'linesWithLastSession30Days',
          labelKey: 'getvsion.indicators.linesWithLastSession30Days',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchIndicator('COUNTER3', 'DATA', this.formatFilters()) };
          },
          counter: 'COUNTER3',
        },
        {
          name: 'nonLocalisableSessions30Days',
          labelKey: 'getvsion.indicators.nonLocalisableSessions30Days',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchIndicator('COUNTER4', 'DATA', this.formatFilters()) };
          },
          counter: 'COUNTER4',
        },
      ],

      cockpitIndicators: [
        {
          name: 'globalActif',
          labelKey: 'getvsion.indicators.globalActif',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await globalActifParc(this.formatFilters()) };
          },
          counter: 'COUNTER1',
        },

        {
          name: 'cockpitData',
          labelKey: 'services.DATA',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchCockpitIndicator(this.formatFilters(), 'DATA') };
          },
          counter: 'DATA',
        },

        {
          name: 'cockpitSMS',
          labelKey: 'services.SMS',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchCockpitIndicator(this.formatFilters(), 'SMS') };
          },
          counter: 'SMS',
        },
        {
          name: 'cockpitVOICE',
          labelKey: 'services.VOICE',
          color: 'text-success',
          clickable: false,
          total: '-',
          fetch: async () => {
            return { total: await fetchCockpitIndicator(this.formatFilters(), 'VOICE') };
          },
          counter: 'VOICE',
        },
      ],
    };
  },

  methods: {
    onIndicatorClick(indicator, total) {
      this.$emit('click', { indicator, total });
    },

    formatFilters() {
      if (!this.appliedFilters || !this.appliedFilters.length) return;

      return this.appliedFilters.reduce((filters, item) => {
        if (item.id === 'getvsion.monitoring.filterByFile') {
          filters.tempDataUuid = item.data.tempDataUuid;
        }

        if (item.id === 'getadmin.users.filters.partnerGroup') {
          filters.partiesDomain = item.data.value;
        }

        if (item.id === 'getadmin.users.filters.partners') {
          filters.partyId = item.data.id;
        }

        if (item.id === 'filters.offers') {
          filters.offerCode = item.data.meta.initialOffer.code;
        }

        if (item.id === 'filters.zone') {
          const selection = item.data;
          if (selection.zone.world) {
            if (selection.country) {
              filters.iso3CountryCode = selection.country.codeIso3;
            }
          } else {
            filters.iso3CountryCode = 'FRA';
            if (selection.zipCode) {
              filters.zipCode = selection.zipCode;
            }
          }
        }

        return filters;
      }, {});
    },
  },

  computed: {
    currentIndicators() {
      if (this.usage === 'ALL') {
        return this.allUsageIndicators;
      }

      if (this.usage === 'DATA') {
        return this.dataUsageIndicators;
      }

      if (this.usage === 'COCKPIT') {
        return this.cockpitIndicators;
      }

      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
