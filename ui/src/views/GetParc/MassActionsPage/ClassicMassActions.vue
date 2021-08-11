<template>
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
</template>

<script>
import FilterBar from './FilterBar';
import HistoryTable from './HistoryTable';
import MassActionsIndicators from './MassActionsIndicators';
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import { currentDateMinusMounts } from '@/utils/date';

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
      isReady: true,
      prevRoute: undefined,
    };
  },
  methods: {
    ...mapActions('actHistory', ['initFilterForContext']),
    ...mapMutations('actHistory', [
      'setCurrentFilters',
      'applyFilters',
      'setRouteParamsFilters',
      'setActDateStartFilter',
      'setActCategoryFilter',
    ]),
    initAfterRouteIsSet() {
      // Ne pas réinitialiser la bare de filtres si on revient du détail d'une ligne

      if (this.prevRoute === 'actDetail') {
        return;
      }

      this.isReady = false;

      let haveDateFilterInQueryFilter = false;
      if (this.$route.params && this.$route.params.queryFilters) {
        this.setRouteParamsFilters(this.$route.params.queryFilters);
        haveDateFilterInQueryFilter = !!this.$route.params.queryFilters.find(
          (f) => f.id === 'filters.actDateStart'
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
            startDate: currentDateMinusMounts(3), // moment().subtract(3, 'month').format('DD/MM/YYYY'),
          });
          this.setActCategoryFilter('STANDARD');
          this.isReady = true;
          setTimeout(() => {
            this.applyFilters();
          });
        }, 100);
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from.name;

      vm.initAfterRouteIsSet();
    });
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
