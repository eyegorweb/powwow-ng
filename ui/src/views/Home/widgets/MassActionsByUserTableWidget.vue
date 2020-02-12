<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <GenericTableWidget
      v-if="resultsPromise"
      :columns="columns"
      :rows="rows"
      :results-promise="resultsPromise"
      :order-by.sync="orderBy"
    />
  </WidgetBloc>
</template>

<script>
import WidgetBloc from './WidgetBloc';
import RateCell from '@/views/GetParc/MassActionsPage/HistoryTable/RateCell';
import { searchMassActions } from '@/api/massActions';
import GenericTableWidget from './GenericTableWidget';
import { mapGetters } from 'vuex';
import { truncateLabel } from '@/utils';

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
    orderBy() {
      this.refreshTable();
    },
  },
  mounted() {
    this.refreshTable();
  },
  computed: {
    ...mapGetters(['userIsPartner', 'userInfos']),

    columns() {
      if (this.userIsPartner) {
        return this.allColumns.filter(c => c.name !== 'party');
      }
      return this.allColumns;
    },

    widgetFilters() {
      const userFilter = [
        {
          id: 'filters.orderCreator',
          values: [
            {
              id: this.userInfos.id,
              label: `${this.userInfos.name.firstName || ''} ${this.userInfos.name.lastName || ''}`,
            },
          ],
        },
      ];
      return [...this.contextFilters, ...userFilter];
    },
  },
  data() {
    return {
      allColumns: [
        {
          id: 1,
          label: this.$t('getparc.history.col.partyId'),
          name: 'partyName',
          orderable: false,
          noHandle: true,
          visible: true,
          tootltipText: (item, row) => {
            return row.partyName;
          },
          format: {
            type: 'Getter',
            getter: row => {
              return truncateLabel(row.partyName);
            },
          },
        },
        {
          id: 2,
          label: this.$t('getparc.history.col.action'),
          name: 'actionType',
          orderable: false,
          noHandle: true,
          visible: true,
          format: {
            type: 'LinkBtn',
            onClick: (actType, line) => {
              this.$router.push({
                name: 'actDetail',
                params: {
                  massActionId: line.id,
                },
              });
            },
            getLabel: actType => {
              return this.$t('getparc.actTypes.' + actType);
            },
          },

          tootltipText: (item, row) => {
            return row.info;
          },
        },
        {
          id: 4,
          label: this.$t('getparc.history.col.status'),
          name: 'status',
          orderabel: false,
          noHandle: true,
          visible: true,
          format: {
            type: 'Getter',
            getter: row => {
              return this.$t('getparc.actLines.massActionsHistory.statuses.' + row.status);
            },
          },
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.created'),
          name: 'created',
          orderabel: false,
          noHandle: true,
          visible: true,
          tootltipText: (item, row) => {
            return row.created;
          },
          format: {
            type: 'Getter',
            getter: row => {
              if (!row.created) return '';
              const parts = row.created.split(' ');
              return parts[0];
            },
          },
        },
        {
          id: 6,
          label: this.$t('getparc.history.col.actDate'),
          name: 'dueDate',
          orderabel: false,
          noHandle: true,
          visible: true,
          tootltipText: (item, row) => {
            return row.dueDate;
          },
          format: {
            type: 'Getter',
            getter: row => {
              if (!row.dueDate) return '';
              const parts = row.dueDate.split(' ');
              return parts[0];
            },
          },
        },
        {
          id: 7,
          label: this.$t('getparc.history.col.rate'),
          name: 'rateActionNumber',
          sortingName: 'UNIT_ACTIONS_FAILED',
          orderable: true,
          noHandle: true,
          visible: true,
          format: {
            component: RateCell,
          },
        },
      ],
      orderBy: { key: 'UNIT_ACTIONS_FAILED', direction: 'DESC' },
      resultsPromise: undefined,
      rows: [],
    };
  },

  methods: {
    async refreshTable() {
      this.resultsPromise = searchMassActions(
        this.orderBy,
        { page: 0, limit: 3 },
        this.widgetFilters
      );
      const response = await this.resultsPromise;
      this.rows = this.formatResponse(response.items);
    },
    onSeeMore() {
      this.$router.push({
        name: 'actHistory',
        params: {
          queryFilters: [...this.widgetFilters],
        },
      });
    },
    formatResponse(response) {
      if (response) {
        return response.map(i => ({ ...i, ...i.massAction }));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
