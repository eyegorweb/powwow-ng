<template>
  <WidgetBloc :widget="widget" @seeMore="onSeeMore">
    <GenericTableWidget
      v-if="resultsPromise"
      :columns="columns"
      :rows="rows"
      :results-promise="resultsPromise"
    />
  </WidgetBloc>
</template>

<script>
import WidgetBloc from '@/views/Home/widgets/WidgetBloc';
import GenericTableWidget from './GenericTableWidget';
import { searchMassActions } from '@/api/massActions';

import ActionCell from '@/views/GetParc/ActHistory/HistoryTable/ActionCell';
import DetailsCell from '@/views/GetParc/ActHistory/HistoryTable/DetailsCell';

export default {
  components: {
    WidgetBloc,
    GenericTableWidget,
  },
  props: {
    widget: Object,
    contextFilters: Array,
  },
  async mounted() {
    this.resultsPromise = searchMassActions(
      { key: 'id', direction: 'DESC' },
      { page: 0, limit: 3 },
      this.widgetFilters
    );
    const response = await this.resultsPromise;
    this.rows = this.formatResponse(response.items);
  },
  methods: {
    onSeeMore() {
      this.$router.push({
        name: 'actLines',
        params: {
          queryFilters: [...this.widgetFilters],
        },
      });
    },
    formatResponse(items) {
      if (items) {
        return items.map(i => {
          const tempObject = {
            user: i.user,
            party: i.party,
            fromParty: i.fromParty,
            toParty: i.toParty,
          };
          return Object.assign({}, i.massActionResponse, tempObject);
        });
      }
    },
  },
  computed: {
    widgetFilters() {
      return [...this.contextFilters, ...this.filters];
    },
  },
  data() {
    return {
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
            onClick: massActionId => {
              this.$router.push({
                name: 'actDetail',
                params: {
                  massActionId,
                },
              });
            },
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
          name: 'actionType',
          orderable: false,
          visible: true,
          noHandle: true,
          format: {
            component: DetailsCell,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.target'),
          name: 'targetActionNumber',
          sortingName: 'target_Action_Number',
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
