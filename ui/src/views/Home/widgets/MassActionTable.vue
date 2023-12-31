<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <GenericTableWidget
      v-if="resultsPromise"
      :columns="columns"
      :rows="rows"
      :order-by.sync="orderBy"
      :results-promise="resultsPromise"
    />
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';
import GenericTableWidget from './GenericTableWidget';
import { searchMassActions } from '@/api/massActions';
import ActionCell from '@/views/GetParc/MassActionsPage/HistoryTable/ActionCell';
import Tooltip from './Tooltip';
import { currentDateMinusMounts } from '@/utils/date';
import { mapGetters } from 'vuex';

export default {
  components: {
    WidgetBloc,
    GenericTableWidget,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  watch: {
    contextFilters() {
      this.refreshTable();
    },
  },
  mounted() {
    this.refreshTable();
  },
  methods: {
    async refreshTable() {
      this.resultsPromise = searchMassActions(
        { key: 'ID', direction: 'DESC' },
        { page: 0, limit: 3 },
        this.widgetFilters
      );
      const response = await this.resultsPromise;
      this.rows = this.formatResponse(response.items);
    },
    onSeeMore() {
      if (this.userIsM2MLight) {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Acte de gestion - OD' });
      } else {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Acte de gestion' });
      }
      this.$router
        .push({
          name: 'actHistory.classic',
          params: {
            queryFilters: [...this.widgetFilters],
          },
        })
        .catch(() => {});
    },
    formatResponse(items) {
      if (items) {
        return items.map((i) => ({ ...i, ...i.massAction }));
      }
    },
  },
  computed: {
    ...mapGetters(['userIsM2MLight']),
    widgetFilters() {
      const startDate = currentDateMinusMounts(3);

      const dateFilter = {
        id: 'filters.actDateStart',
        startDate,
      };
      return [...this.contextFilters, ...this.filters, dateFilter];
    },
  },
  data() {
    return {
      orderBy: { key: 'creationDate', direction: 'DESC' },
      filters: [
        {
          id: 'filters.category',
          value: 'STANDARD',
          hidden: true,
        },
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
      columns: [
        {
          id: 1,
          label: this.$t('col.id'),
          name: 'id',
          orderable: false,
          noHandle: true,
          visible: true,
          fixed: true,
          format: {
            type: 'LinkBtn',
            onClick: (massActionId) => {
              this.$router
                .push({
                  name: 'actDetail',
                  params: {
                    massActionId,
                  },
                })
                .catch(() => {});
            },
            isClickable: () => true,
          },
        },
        {
          id: 2,
          label: this.$t('getparc.history.col.action'),
          name: 'actionType',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            component: ActionCell,
          },
        },
        {
          id: 4,
          label: this.$t('getparc.history.col.details'),
          name: 'info',
          orderable: false,
          visible: true,
          tootltipText: (item) => {
            return item;
          },
          format: {
            component: Tooltip,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.target'),
          name: 'targetActionNumber',
          sortingName: 'TARGET_ACTION_NUMBER',
          orderable: false,
          visible: true,
          noHandle: true,
        },
        {
          id: 3,
          label: this.$t('getparc.history.col.actDate'),
          name: 'dueDate',
          orderable: false,
          visible: true,
          noHandle: true,
        },
        {
          id: 13,
          label: this.$t('getparc.history.col.status'),
          name: 'status',
          sortingName: 'STATUS',
          orderable: false,
          visible: true,
          noHandle: true,
        },
      ],
      resultsPromise: undefined,
      rows: [],
    };
  },
};
</script>

<style lang="scss" scoped></style>
