<template>
  <div class="mb-3">
    <Indicators
      :key="version"
      v-if="currentIndicators"
      :meta="currentIndicators"
      :on-click="onIndicatorClick"
    />
  </div>
</template>

<script>
import Indicators from '@/components/Indicators';
import { globalActifParc } from '@/api/supervisionIndicators.js';

export default {
  components: {
    Indicators,
  },
  props: {
    usage: String,
    appliedFilters: Array,
  },

  watch: {
    appliedFilters() {
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
        },
        {
          name: 'lineWithoutTraffic',
          labelKey: 'getvsion.indicators.lineWithoutTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: 99 };
          },
        },
        {
          name: 'linesWIthoutTraffic30Days',
          labelKey: 'getvsion.indicators.linesWIthoutTraffic30Days',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: 99 };
          },
        },
        {
          name: 'linesNonLocalizedTraffic',
          labelKey: 'getvsion.indicators.linesNonLocalizedTraffic',
          color: 'text-success',
          clickable: true,
          total: '-',
          fetch: async () => {
            return { total: 99 };
          },
        },
      ],
    };
  },

  methods: {
    onIndicatorClick(indicator) {
      console.log('INDICATOR >>', indicator);
    },

    formatFilters() {
      if (!this.appliedFilters || !this.appliedFilters.length) return;

      return this.appliedFilters.reduce((filters, item) => {
        console.log('Item >>', item);
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

      return undefined;
    },
  },
};
</script>

<style lang="scss" scoped></style>
