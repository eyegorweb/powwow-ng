<template>
  <div class="mt-4">
    <div class="row mb-5">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-act') }}
          <i class="ic-Info-Icon" />
        </h4>
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <MassActionsIndicators />
        <br />
        <FilterBar />
      </div>
      <div class="col-md-9">
        <HistoryTable />
      </div>
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar';
import HistoryTable from './HistoryTable';
import MassActionsIndicators from './MassActionsIndicators';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import moment from 'moment';

export default {
  components: {
    FilterBar,
    HistoryTable,
    MassActionsIndicators,
  },
  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapGetters('actHistory', ['currentFilters']),
  },
  data() {
    return {
      prevRoute: undefined,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from.name;
      vm.initAfterRouteIsSet();
    });
  },
  methods: {
    ...mapActions('actHistory', ['initFilterForContext']),
    ...mapMutations('actHistory', [
      'setCurrentFilters',
      'applyFilters',
      'setRouteParamsFilters',
      'setActDateStartFilter',
    ]),
    initAfterRouteIsSet() {
      // Ne pas réinitialiser la bare de filtres si on reviens du détail d'une ligne
      if (this.prevRoute === 'actDetail') return;

      if (this.$route.params && this.$route.params.queryFilters) {
        this.setRouteParamsFilters(this.$route.params.queryFilters);
      }
      this.initFilterForContext();
      if (this.$route.params && this.$route.params.preselectFailedFilter) {
        setTimeout(() => {
          this.setCurrentFilters([
            {
              id: 'filters.actStatus',
              values: [
                {
                  id: 'IN_ERROR',
                  label: 'En erreur',
                },
              ],
            },
            {
              id: 'filters.actDateStart',
              startDate: undefined,
              endDate: moment()
                .subtract(6, 'month')
                .format('DD/MM/YYYY'),
            },
          ]);
          this.applyFilters();
        }, 500);
      } else {
        setTimeout(() => {
          this.setActDateStartFilter({
            startDate: moment()
              .subtract(3, 'month')
              .format('DD/MM/YYYY'),
            endDate: moment().format('DD/MM/YYYY'),
          });
          this.applyFilters();
        });
      }
    },
  },
  watch: {
    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>

<style scoped></style>
