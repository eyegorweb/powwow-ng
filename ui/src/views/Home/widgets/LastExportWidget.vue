<template>
    <WidgetBloc :widget="widget" @seeMore="onSeeMore">
      <div v-if="reports && reports.items && reports.items.length > 0">
        <table class="table">
          <tbody>
            <tr :key="report.reference" v-for="report in reports.items">
              <td>{{ report.created }}</td>
  
              <td>{{ reportNameTruncate(report.documentName) }}</td>
  
              <td>
                <i
                  class="ic-Download-Icon cursorP"
                  v-if="report.fileName"
                  @click="downloadReport(report.id)"
                ></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="alert-light">
        {{ $t('noResultExport') }}
      </div>
    </WidgetBloc>
  </template>
  
  <script>
    import WidgetBloc from './WidgetBloc';
    import { fetchAllDocuments } from '@/api/documents';
    import { mapMutations } from 'vuex';
    import { getBaseURL } from '@/utils.js';
    import { truncateLabel } from '@/utils';
  
  export default {
    components: {
      WidgetBloc,
    },
    props: {
      widget: Object,
      contextFilters: Array,
    },
    data() {
      return {
        reports: undefined,
        orderBy: {
            key: 'creationDate',
            direction: 'DESC',
        },
      };
    },

    async mounted() {      
        this.reports = await fetchAllDocuments(this.orderBy,  { page: 0, limit: 5 });
    },
  
    methods: {
      ...mapMutations(['startDownload']),
  

      reportNameTruncate(report) {
        return truncateLabel(report, 20)
      },

      onSeeMore() {
        this.$pushAnalytics({ event: 'm2m.seeMore', widget: 'Derniers exports' });
        this.$router.push({
          name: 'documents',
          params: {
            queryFilters: [],
          },
        });
      },
  
      downloadReport(id) {
        this.startDownload(`${getBaseURL()}/api/file/download/document/${id}`);
        return;
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .table {
    .cursorP {
      cursor: pointer;
    }
  
    td {
      font-size: 0.8rem;
      color: #454545;
    }
  }
  </style>
  