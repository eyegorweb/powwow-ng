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
import WidgetBloc from './WidgetBloc';
import DetailsCell from '@/views/GetParc/ActHistory/HistoryTable/DetailsCell';
import RateCell from '@/views/GetParc/ActHistory/HistoryTable/RateCell';
import StatusCell from '@/views/GetParc/LineDetail/DetailsTab/ActsHistory/StatusCell';
import { searchMassActions } from '@/api/massActions';
import GenericTableWidget from './GenericTableWidget';
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
          name: 'party',
          orderable: false,
          noHandle: true,
          sortingName: 'partyName',
          visible: true,
          format: {
            type: 'ObjectAttribute',
            path: 'name',
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
        },
        {
          id: 3,
          label: this.$t('getparc.history.col.details'),
          name: 'actionType',
          orderabel: false,
          noHandle: true,
          visible: true,
          format: {
            component: DetailsCell,
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
            component: StatusCell,
          },
        },
        {
          id: 5,
          label: this.$t('getparc.history.col.created'),
          name: 'created',
          orderabel: false,
          noHandle: true,
          visible: true,
        },
        {
          id: 6,
          label: this.$t('getparc.history.col.actDate'),
          name: 'dueDate',
          orderabel: false,
          noHandle: true,
          visible: true,
        },
        {
          id: 7,
          label: this.$t('getparc.history.col.rate'),
          name: 'rateActionNumber',
          sortingName: 'rate_Action_Number',
          orderabel: false,
          noHandle: true,
          visible: true,
          format: {
            component: RateCell,
          },
        },
      ],
      resultsPromise: undefined,
      rows: [],
    };
  },

  methods: {
    async refreshTable() {
      this.resultsPromise = searchMassActions(
        { key: 'id', direction: 'DESC' },
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
        return response.map(i => {
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
};
</script>

<style lang="scss" scoped></style>
