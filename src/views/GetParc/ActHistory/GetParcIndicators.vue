<template>
  <ul class="list-group bg-white">
    <li class="list-group-item">
      {{ $t('indicators.actionsInProgress') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-warning"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsInProgress)"
        >
          {{ indicators.actionsInProgress.value }}
        </button>
      </div>
    </li>
    <li class="list-group-item">
      {{ $t('indicators.actionsFailed') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsFailed)"
        >
          {{ indicators.actionsFailed.value }}
        </button>
      </div>
    </li>
    <li class="list-group-item">
      {{ $t('indicators.actionsPlanned') }}
      <div class="float-right">
        <button
          class="btn btn-link p-0 text-danger"
          @click.prevent="filterByStatusIndicator(filteredStatus.actionsPlanned)"
        >
          {{ indicators.actionsPlanned.value }}
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
// import { getActStatuses } from '@/api/actStatuses';
import { mapMutations } from 'vuex';
import moment from 'moment';

const dateFormat = 'DD-MM-YYYY';

export default {
  data() {
    return {
      indicators: {
        actionsInProgress: {
          value: '1',
        },
        actionsFailed: {
          value: '0',
        },
        actionsPlanned: {
          value: '3',
        },
      },
      filteredStatus: {
        actionsInProgress: {
          status: [{ id: 'IN_PROGRESS', label: this.$t('getparc.history.col.ongoing') }],

          date: {
            range: {
              start: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              end: moment().format(dateFormat),
            },
          },
        },
        actionsFailed: {
          status: [{ id: 'IN_ERROR', label: this.$t('getparc.history.col.onfailing') }],
          date: {
            range: {
              start: moment()
                .subtract(6, 'month')
                .format(dateFormat),
              end: moment().format(dateFormat),
            },
          },
        },
        actionsPlanned: {
          date: {
            range: {
              start: moment().format(dateFormat),
              end: moment()
                .add(6, 'month')
                .format(dateFormat), // TODO: dateFormat setting from dateCreation
            },
          },
        },
      },
    };
  },

  methods: {
    ...mapMutations('actHistory', ['setCurrentFilters', 'applyFilters']),
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

  async created() {
    // this.indicators = (await getActStatuses()) || {};
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
