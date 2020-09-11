<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore" scrolling small>
    <div slot="header">
      <div class="d-flex">
        <UiSelect
          v-if="canSelectPartner"
          class="text-gray"
          v-model="selectedPartner"
          :placeholder="$t('getparc.actCreation.ManageCancellation.choose')"
          :options="names"
          small
        ></UiSelect>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">{{ $t('status') }}</th>
          <th scope="col">{{ $t('home.widgets.stateParc.currentMonth') }}</th>
          <th scope="col">{{ $t('home.widgets.stateParc.prevMonth') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ $t('home.widgets.stateParc.stockLines') }}
            <Tooltip direction="right">{{ $t('home.widgets.stateParc.notPreactivated') }}</Tooltip>
          </td>
          <td>
            {{ formatMoreThanMillion(totalCurrentMonthNotPreactivatedLines) }}
          </td>
          <td>
            {{ formatMoreThanMillion(totalPreviousMonthNotPreactivatedLines) }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t('indicators.getparc.lines.allocatedSIMCards') }}
          </td>
          <td>
            {{ formatMoreThanMillion(totalCurrentMonthPreactivatedLines) }}
          </td>
          <td>
            {{ formatMoreThanMillion(totalPreviousMonthPreactivatedLines) }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.activatedLines') }}</td>
          <td>{{ formatMoreThanMillion(totalCurrentMonthActivatedLines) }}</td>
          <td>{{ formatMoreThanMillion(totalPreviousMonthActivatedLines) }}</td>
        </tr>
        <tr>
          <td>
            {{ $t('home.widgets.stateParc.suspendedLines') }}
            <Tooltip direction="right">{{ $t('home.widgets.stateParc.linesSuspended') }}</Tooltip>
          </td>
          <td>
            {{ formatMoreThanMillion(totalCurrentMonthSuspendedLines) }} ({{
              formatMoreThanMillion(totalCurrentMonthNotSuspendedLines)
            }})
          </td>
          <td>
            {{ formatMoreThanMillion(totalPreviousMonthSuspendedLines) }} ({{
              formatMoreThanMillion(totalPreviousNotMonthSuspendedLines)
            }})
          </td>
        </tr>
        <tr>
          <td>{{ $t('home.widgets.stateParc.cancellationLines') }}</td>
          <td>{{ formatMoreThanMillion(totalCurrentMonthTerminatedLines) }}</td>
          <td>{{ formatMoreThanMillion(totalPreviousMonthTerminatedLines) }}</td>
        </tr>
      </tbody>
    </table>
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import Tooltip from '@/components/ui/Tooltip';
import UiSelect from '@/components/ui/UiSelect';
import { mapGetters, mapState } from 'vuex';
import { fetchpartners } from '@/api/partners';
import { fetchAlarmInstancesIndicators } from '@/api/alarms';
import moment from 'moment';
import { DATE_FORMAT } from '@/utils/date';

const currentMonth = moment()
  .startOf('month')
  .format(DATE_FORMAT);
const prevCurrentMonth = moment()
  .subtract(1, 'month')
  .startOf('month')
  .format(DATE_FORMAT);

export default {
  components: {
    WidgetBloc,
    Tooltip,
    UiSelect,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  data() {
    return {
      selectedPartner: undefined,
      partners: [],
      names: [],
      selectedParnerId: undefined,
      historyDepth: 2,
      histories: [
        {
          name: 'SIM_NOT_PREACTIVATED',
          currentMonthValue: null,
          previousMonthValue: null,
        },
        {
          name: 'SIM_PREACTIVATED',
          currentMonthValue: null,
          previousMonthValue: null,
        },
        {
          name: 'SIM_ACTIVATED',
          currentMonthValue: null,
          previousMonthValue: null,
        },
        {
          name: 'SIM_SUSPENDED',
          currentMonthValue: null,
          previousMonthValue: null,
        },
        {
          name: 'SIM_SUSPENDED_NOT_BILLED',
          currentMonthValue: null,
          previousMonthValue: null,
        },
        {
          name: 'SIM_TERMINATION_IN_PROGRESS',
          currentMonthValue: null,
          previousMonthValue: null,
        },
      ],
      filters: [
        {
          id: 'filters.actStatus',
          values: [
            {
              id: 'IN_PROGRESS',
              label: 'En cours',
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.initPartners();
    this.refreshTable(this.selectedParnerId);
  },
  computed: {
    ...mapGetters(['userIsPartner']),
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    canSelectPartner() {
      return this.names && this.names.length > 0 && !this.userIsPartner;
    },
    totalCurrentMonthNotPreactivatedLines() {
      return parseInt(this.histories[0].currentMonthValue);
    },
    totalPreviousMonthNotPreactivatedLines() {
      return parseInt(this.histories[0].previousMonthValue);
    },
    totalCurrentMonthPreactivatedLines() {
      return parseInt(this.histories[1].currentMonthValue);
    },
    totalPreviousMonthPreactivatedLines() {
      return parseInt(this.histories[1].previousMonthValue);
    },
    totalCurrentMonthActivatedLines() {
      return parseInt(this.histories[2].currentMonthValue);
    },
    totalPreviousMonthActivatedLines() {
      return parseInt(this.histories[2].previousMonthValue);
    },
    totalCurrentMonthSuspendedLines() {
      const total =
        parseInt(this.histories[3].currentMonthValue) +
        parseInt(this.histories[4].currentMonthValue);
      return total;
    },
    totalPreviousMonthSuspendedLines() {
      const total =
        parseInt(this.histories[3].previousMonthValue) +
        parseInt(this.histories[4].previousMonthValue);
      return total;
    },
    totalCurrentMonthNotSuspendedLines() {
      return parseInt(this.histories[4].currentMonthValue);
    },
    totalPreviousNotMonthSuspendedLines() {
      return parseInt(this.histories[4].previousMonthValue);
    },
    totalCurrentMonthTerminatedLines() {
      return parseInt(this.histories[5].currentMonthValue);
    },
    totalPreviousMonthTerminatedLines() {
      return parseInt(this.histories[5].previousMonthValue);
    },
  },
  methods: {
    formatMoreThanMillion(num) {
      if (Math.abs(num) > 999999) {
        return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(2) + 'M';
      } else if (Math.abs(num) > 9999) {
        return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'K';
      } else {
        return num;
      }
    },

    async fetchPartners(q, { page, limit }) {
      const data = await fetchpartners(q, {
        page,
        limit,
        partnerType: this.contextPartnersType,
      });
      if (data) {
        return data.map(p => ({
          id: p.id,
          name: p.name,
        }));
      }
      return undefined;
    },
    fetchPartnerId(id) {
      const found = this.partners.find(p => p.name === id);
      this.selectedParnerId = found ? found.id : '';
    },
    async initPartners() {
      if (this.contextPartners && this.contextPartners.length > 0) {
        this.partners = this.contextPartners.map(p => ({
          id: p.id,
          name: p.name,
        }));
      } else {
        this.partners = await this.fetchPartners('', { page: 0, limit: 999 });
      }
      this.names = this.partners.map(p => p.name);
    },
    async refreshTable(id) {
      if (id) this.fetchPartnerId(id);
      const response = await fetchAlarmInstancesIndicators(
        [
          'SIM_NOT_PREACTIVATED',
          'SIM_PREACTIVATED',
          'SIM_ACTIVATED',
          'SIM_SUSPENDED',
          'SIM_TERMINATION_IN_PROGRESS',
          'SIM_SUSPENDED_NOT_BILLED',
        ],
        this.historyDepth,
        [this.selectedParnerId]
      );
      if (response) {
        this.histories.filter((h, index) => {
          const data = response.filter(r => r.name === h.name).map(r => r.histories);
          this.histories[index].currentMonthValue = data[0]
            .filter(h => h.applicationDate === currentMonth)
            .map(v => v.numberValue)
            .join('');
          this.histories[index].previousMonthValue = data[0]
            .filter(h => h.applicationDate === prevCurrentMonth)
            .map(v => v.numberValue)
            .join('');
        });
      }
    },
    onClick() {
      this.$router.push({
        name: 'actLines',
        params: {
          queryFilters: this.filters,
        },
      });
    },
    onSeeMore() {
      this.$router.push({
        name: 'reports',
        params: {
          queryFilters: [],
        },
      });
    },
  },
  watch: {
    selectedPartner(newValue) {
      this.refreshTable(newValue);
    },
    contextPartners() {
      this.initPartners();
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  th {
    font-size: 0.7rem;
    border-top: none;
    color: $dark-gray;
    text-transform: uppercase;
    font-weight: 500;
    padding: 0.5rem 0.5rem 0.4rem;
  }
  td {
    font-size: 0.9rem;
    color: $dark-gray;
    padding: 0.5rem 0.5rem 0.4rem;
  }
}
</style>
