<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">
      {{ $t('indicators.getsim.actionsInProgress') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsInProgress)"
        >
          {{ filteredStatus.actionsInProgress.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item" v-if="filteredStatus.actionsFailed.total > 0">
      {{ $t('indicators.getsim.actionsFailed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsFailed)"
        >
          {{ filteredStatus.actionsFailed.total }}
        </button>
      </div>
    </li>
    <li class="list-group-item">
      {{ $t('indicators.getsim.actionsPlanned') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsPlanned)"
        >
          {{ filteredStatus.actionsPlanned.total }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import { countTotalByMassActionIndicators } from '@/api/massActions';
import { mapMutations, mapState } from 'vuex';
import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';

export default {
  data() {
    return {
      filteredStatus: {
        actionsInProgress: {
          total: 0,
          status: [{ id: 'IN_PROGRESS', label: this.$t('getparc.history.col.ongoing') }],

          date: {
            range: {
              end: moment()
                .subtract(6, 'month')
                .format(dateFormat),
            },
          },
        },
        actionsFailed: {
          total: 0,
          status: [{ id: 'IN_ERROR', label: this.$t('getparc.history.col.onfailing') }],
          date: {
            range: {
              end: moment()
                .subtract(6, 'month')
                .format(dateFormat),
            },
          },
        },
        actionsPlanned: {
          total: 0,
          date: {
            range: {
              // start: moment().format(dateFormat),
              // end: moment()
              //   .add(6, 'month')
              //   .format(dateFormat), // TODO: dateFormat setting from dateCreation
              start: moment.min().format(dateFormat),
            },
          },
        },
      },
    };
  },

  methods: {
    ...mapMutations('actHistory', ['setCurrentFilters', 'applyFilters']),
    async initComponent() {
      let contextPartnersFilter = {};
      let contextPartnerTypesFilter = {};

      if (this.contextPartnersTypes && this.contextPartnersTypes.length) {
        contextPartnerTypesFilter = {
          id: 'filters.partnerTypes',
          values: this.contextPartnersTypes,
        };
      }
      if (this.contextPartners && this.contextPartners.length) {
        contextPartnersFilter = {
          id: 'filters.partners',
          values: this.contextPartners,
        };
      }

      // Pour les utilisateurs de type partenaire, il faudra chercher le partner de l'utilisateur dans le filtre par défaut ( initialisé au démarrage de la page)
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        contextPartnersFilter = this.defaultAppliedFilters;
      }

      const filterIndicatorActionsInProgress = [
        {
          id: 'filters.actStatus',
          values: this.filteredStatus.actionsInProgress.status,
        },
        {
          id: 'filters.actDateStart',
          startDate: this.filteredStatus.actionsInProgress.date.range.start,
          endDate: this.filteredStatus.actionsInProgress.date.range.end,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];
      const filterIndicatorActionsFailed = [
        {
          id: 'filters.actStatus',
          values: this.filteredStatus.actionsFailed.status,
        },
        {
          id: 'filters.actDateStart',
          startDate: this.filteredStatus.actionsFailed.date.range.start,
          endDate: this.filteredStatus.actionsFailed.date.range.end,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];
      const filterIndicatorActionsToApply = [
        {
          id: 'filters.actStatus',
          values: this.filteredStatus.actionsPlanned.status,
        },
        {
          id: 'filters.actDateStart',
          startDate: this.filteredStatus.actionsPlanned.date.range.start,
        },
        { ...contextPartnersFilter },
        { ...contextPartnerTypesFilter },
      ];

      try {
        const result = await countTotalByMassActionIndicators(
          filterIndicatorActionsInProgress,
          filterIndicatorActionsFailed,
          filterIndicatorActionsToApply
        );
        this.filteredStatus.actionsInProgress.total = result.indicatorActionsInProgress.total;
        this.filteredStatus.actionsFailed.total = result.indicatorActionsFailed.total;
        this.filteredStatus.actionsPlanned.total = result.indicatorActionsToApply.total;
      } catch {
        this.filteredStatus.actionsInProgress.total = 0;
        this.filteredStatus.actionsFailed.total = 0;
        this.filteredStatus.actionsPlanned.total = 0;
      }
    },
    filterByStatusIndicator(preselectedFilter) {
      let statusFilter = {},
        dateFilter = {};

      if (preselectedFilter.status) {
        statusFilter = {
          id: 'filters.actStatus',
          values: preselectedFilter.status,
        };
      }

      if (preselectedFilter.date) {
        dateFilter = {
          id: 'filters.actDateCreation',
          startDate: preselectedFilter.date.range.start,
          endDate: preselectedFilter.date.range.end,
        };
      }

      this.setCurrentFilters([
        {
          ...statusFilter,
        },
        {
          ...dateFilter,
        },
      ]);

      this.applyFilters();
    },
  },

  computed: {
    ...mapState('getsim', ['defaultAppliedFilters']),
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },

  async mounted() {
    this.initComponent();
  },
};
</script>

<style lang="scss" scoped>
.list-group {
  padding: 1.25rem 1rem;

  .list-group-item {
    border: none;
    padding: 0.75rem 0;
    border-bottom: 2px solid $medium-gray;

    &:last-child {
      border: none;
    }
  }
}
</style>
