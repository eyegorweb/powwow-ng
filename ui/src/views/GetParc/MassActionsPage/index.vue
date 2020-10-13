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
        <HistoryTable v-if="isReady" />
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
      isReady: false,
    };
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

      let haveDateFilterInQueryFilter = false;
      if (this.$route.params && this.$route.params.queryFilters) {
        console.log(
          'initAfterRouteIsSet -> this.$route.params.queryFilters',
          this.$route.params.queryFilters
        );
        this.setRouteParamsFilters(this.$route.params.queryFilters);
        haveDateFilterInQueryFilter = !!this.$route.params.queryFilters.find(
          f => f.id === 'filters.actDateStart'
        );
      }
      this.initFilterForContext();

      if (haveDateFilterInQueryFilter) {
        this.isReady = true;
        setTimeout(() => {
          this.applyFilters();
        });
      } else {
        setTimeout(() => {
          this.setActDateStartFilter({
            startDate: moment()
              .subtract(3, 'month')
              .format('DD/MM/YYYY'),
            endDate: moment().format('DD/MM/YYYY'),
          });
          this.isReady = true;
          setTimeout(() => {
            this.applyFilters();
          });
        }, 100);
      }
    },
  },
  mounted() {
    this.initAfterRouteIsSet();
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
