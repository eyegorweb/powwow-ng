<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-lines') }}
          <Tooltip direction="right">{{ $t('getparc.tooltip-title-text') }}</Tooltip>
        </h4>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-12">
        <ActionCarousel
          title="getparc.actLines.chooseAct"
          :actions="carouselItems"
          @itemClick="onCarouselItemClick"
        />
      </div>
    </div>

    <ActCreationPrerequisites v-if="creationMode" :act="actToCreate" />

    <div class="row">
      <div class="col-md-3">
        <Indicators :meta="indicators" :on-click="onClick" />
        <br />

        <FilterBar />
      </div>
      <div class="col-md-9 extra-bottom-margin">
        <Title
          num="1"
          v-if="creationMode && actCreationPrerequisites && actToCreate.containFile"
          title="getparc.actLines.step1File"
          :color="actToCreate.color"
          :uppercase="true"
        />
        <DropZone
          v-if="creationMode && actCreationPrerequisites && actToCreate.containFile"
          v-model="selectedFile"
        />

        <Title
          num="1"
          v-if="creationMode && !actToCreate.containFile"
          title="getparc.actLines.step1Title"
          :color="actToCreate.color"
          :uppercase="true"
        />
        <LinesTable
          v-if="canShowTable"
          :creation-mode="canShowForm"
          @noResults="checkTableResult"
        />

        <Title
          num="2"
          v-if="canShowForm"
          :title="actToCreate.stepTitle"
          :color="actToCreate.color"
          :uppercase="true"
        />
        <ActCreationActForm
          v-if="canShowForm"
          :act="actToCreate"
          :key="actToCreateFormVersionChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import FilterBar from './FilterBar';
import LinesTable from './LinesTable';
import Title from './Title';
import ActCreationPrerequisites from './ActCreation/Prerequisites';
import ActCreationActForm from './ActCreation/ActForm';
import ActionCarousel from './ActionCarousel';
import Indicators from '@/components/Indicators';
import DropZone from '@/components/ui/DropZone';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

import lineIndicators from './lineIndicators';
import carouselItems from './carouselItems';

export default {
  components: {
    Tooltip,
    FilterBar,
    LinesTable,
    ActionCarousel,
    Indicators,
    ActCreationPrerequisites,
    ActCreationActForm,
    Title,
    DropZone,
  },
  data() {
    return {
      prereqSet: false,
      indicators: lineIndicators,
      tableIsEmpty: true,
      prevRoute: undefined,

      // Pour recréer le composant ActForm à chaque changement des prérequis
      actToCreateFormVersionChange: 0,
    };
  },

  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    ...mapState('actLines', [
      'defaultAppliedFilters',
      'actCreationPrerequisites',
      'selectedFileForActCreation',
    ]),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userIsPartner']),

    ...mapState({
      actToCreate: state => state.actLines.actToCreate,
    }),
    carouselItems() {
      if (this.userIsPartner) {
        return carouselItems.filter(i => !i.boOnly);
      }
      return carouselItems;
    },
    canShowForm() {
      return this.creationMode && this.actCreationPrerequisites && !this.tableIsEmpty;
    },
    selectedFile: {
      get() {
        return this.selectedFileForActCreation;
      },
      set(newFile) {
        this.setSelectedFileForActCreation(newFile);
      },
    },
    creationMode() {
      return this.actToCreate;
    },
    canShowTable() {
      if (this.actToCreate) {
        if (this.actToCreate.containFile) {
          if (this.actCreationPrerequisites) {
            return false;
          } else {
            return true;
          }
        }
      }
      return true;
    },
    partnersForIndicators() {
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        return this.defaultAppliedFilters.find(f => f.id === 'filters.partners');
      }

      return null;
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from.name;
      vm.initAfterRouteIsSet();
    });
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext', 'mergeCurrentFiltersWith']),
    ...mapMutations('actLines', [
      'setCurrentFilters',
      'applyFilters',
      'setActToCreate',
      'setActCreationPrerequisites',
      'setSelectedLinesForActCreation',
      'setSelectedFileForActCreation',
      'setPageLimit',
      'setRouteParamsFilters',
    ]),

    initAfterRouteIsSet() {
      // Ne pas réinitialiser la bare de filtres si on reviens du détail d'une ligne
      if (this.prevRoute === 'lineDetail' && this.linesActionsResponse) return;
      if (this.$route.params && this.$route.params.queryFilters) {
        this.setRouteParamsFilters(this.$route.params.queryFilters);
      }
      this.initFilterForContext();
    },

    checkTableResult(result) {
      this.tableIsEmpty = result;
    },

    onCarouselItemClick(item) {
      let isSelected = false;
      let newSelectionState = true;

      if (this.actToCreate) {
        isSelected = this.actToCreate.title === item.title;
        newSelectionState = !isSelected;
      }

      if (newSelectionState) {
        // déjà en mode création, sur un autre acte
        if (this.creationMode) {
          this.setActCreationPrerequisites(null);
          this.setSelectedLinesForActCreation([]);
        }

        if (item.filters) {
          this.setActToCreate(item);
          this.mergeCurrentFiltersWith(item.filters);
        }
      } else {
        this.setPageLimit(20);
        this.setActToCreate(null);
        this.setActCreationPrerequisites(null);
        this.setSelectedLinesForActCreation([]);
      }
    },

    onClick(indicator) {
      if (!indicator.overrideClick) {
        this.setCurrentFiltersForIndicator(indicator);
      } else {
        if (indicator.labelKey === 'indicators.getparc.lines.failed') {
          this.$router.push({ name: 'actHistory', params: { preselectFailedFilter: true } });
        }
      }
    },

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },

    onPrereqSet() {
      this.prereqSet = true;
    },
  },

  watch: {
    contextPartnersTypes() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
    defaultAppliedFilters() {
      // refresh indicators
      this.indicators = [...this.indicators];
    },
    actToCreate() {
      this.actToCreateFormVersionChange += 1;
    },
    actCreationPrerequisites() {
      this.actToCreateFormVersionChange += 1;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .step-title .text {
  padding-left: 5px;
  font-size: 16px;
  font-weight: bold;
}

.extra-bottom-margin {
  margin-bottom: 5rem;
}
</style>
