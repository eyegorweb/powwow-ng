<template>
  <div>
    <div class="row">
      <div class="col-2">
        <slot />
      </div>
      <div class="col-10">
        <Toggle
          v-if="toggleValues"
          @update="supervisionType = $event.id"
          :values="toggleValues"
          class="pl-2"
        />
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

export default {
  components: {
    Toggle,
    CockpitDataGraph,
    CockpitSmsGraph,
    CockpitVoiceGraph,
  },
  props: {
    markerData: Object,
    appliedFilters: Array,
  },
  data() {
    return {
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

      return this.appliedFilters.reduce((filters, item) => {
        if (item.id === 'getadmin.users.filters.partners') {
          filters.partyIds = [item.data.id];
        }

        if (item.id === 'filters.country') {
          filters.locationCode = item.data.codeIso3;
        }

        return filters;
      }, {});
    },
  },
};
</script>

<style lang="scss" scoped></style>
