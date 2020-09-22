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
      <div class="col-md-3" v-if="userIsBO">
        <UiButton variant="accent" block class="float-right" @click="openCreateSimCardsPanel()">{{
          $t('getparc.lines-sim-import')
        }}</UiButton>
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
        <Indicators
          :meta="indicators"
          :on-click="onClick"
          :disable-click="!!creationMode"
          precalculated
        />
        <br />
        <FilterBar v-if="!transferSim" />
      </div>
      <TransferSim v-if="transferSim" class="col-md-9" />
      <div class="col-md-9 extra-bottom-margin" v-if="!transferSim">
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
          v-if="canShowTable && canMounTable"
          :creation-mode="canShowForm"
          @noResults="checkTableResult"
        >
          <template v-if="canShowForm" slot="title">
            {{
              $t('getparc.actLines.selected', {
                total: totalSelected,
              })
            }}
          </template>
        </LinesTable>

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
import TransferSim from './ActCreation/forms/TransferSim';
import Title from './Title';
import UiButton from '@/components/ui/Button';
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
    TransferSim,
    ActionCarousel,
    Indicators,
    ActCreationPrerequisites,
    ActCreationActForm,
    Title,
    DropZone,
    UiButton,
  },
  data() {
    return {
      canMounTable: true,
      prereqSet: false,
      indicators: lineIndicators,
      tableIsEmpty: true,
      prevRoute: undefined,
      transferSim: false,
      file: undefined,
      // Pour recréer le composant ActForm à chaque changement des prérequis
      actToCreateFormVersionChange: 0,
    };
  },

  computed: {
    ...mapState('userContext', ['contextPartnersType', 'contextPartners']),
    ...mapState('actLines', [
      'currentFilters',
      'defaultAppliedFilters',
      'actCreationPrerequisites',
      'selectedFileForActCreation',
      'selectedLinesForActCreation',
      'formVersion',
      'searchingById',
    ]),
    ...mapGetters('actLines', ['appliedFilters', 'linesActionsResponse']),
    ...mapGetters(['userIsPartner', 'userIsBO', 'singlePartner']),

    ...mapState({
      actToCreate: state => state.actLines.actToCreate,
    }),

    totalSelected() {
      const responseTotal = this.linesActionsResponse ? this.linesActionsResponse.total : 0;
      return this.selectedLinesForActCreation.length || responseTotal;
    },
    carouselItems() {
      if (this.userIsPartner) {
        return carouselItems
          .filter(i => {
            return !i.boOnly;
          })
          .filter(i => {
            if (i.restrictPartnerType && this.singlePartner) {
              return !(this.singlePartner.partyType === i.restrictPartnerType);
            }
            return true;
          });
      }
      return carouselItems;
    },
    canShowForm() {
      const actWithFileUpload = this.creationMode && this.creationMode.containFile;
      let resultsConstraint = actWithFileUpload || !this.tableIsEmpty;

      return this.creationMode && this.actCreationPrerequisites && resultsConstraint;
    },
    selectedFile: {
      get() {
        return this.selectedFileForActCreation;
      },
      set(newFile) {
        this.setSelectedFileForActCreation(newFile);
        this.file = newFile;
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
  mounted() {
    this.setActToCreate(null);

    /**
     * la recherche n'est pas réinitialisée au retour de la page de détails, du coup on doit mettre la bonne valeur dans cette variable.
     */
    if (this.$route.params && this.$route.params.fromDetail) {
      this.tableIsEmpty = false;
    }
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
      'resetAfterFilterClear',
      'resetState',
    ]),
    ...mapMutations(['openPanel']),

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

      if (item.stepTitle === 'getparc.actCreation.carouselItem.SIM_TRANSFER') {
        this.transferSim = true;
      }

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
          let needToReset = item.havePrereqs;

          if (!this.userIsPartner && !item.havePrereqs) {
            needToReset = true;
          }

          if (needToReset) {
            this.resetState();
          }

          this.$nextTick(() => {
            this.setActToCreate(item);
            this.mergeCurrentFiltersWith(item.filters);
          });
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

    openCreateSimCardsPanel() {
      this.openPanel({
        title: this.$t('getparc.lines-sim-import'),
        panelId: 'getparc.lines-sim-import',
        wide: false,
        backdrop: true,
        ignoreClickAway: true,
      });
    },
  },

  watch: {
    formVersion() {
      this.canMounTable = false;
      this.$nextTick(() => {
        this.canMounTable = true;
      });
    },
    currentFilters(currentFilters) {
      const haveValues = !!currentFilters.find(filter => {
        return (
          (filter.values && filter.values.length) ||
          filter.value ||
          filter.startDate ||
          filter.endDate ||
          filter.from ||
          filter.to
        );
      });

      if (!haveValues && !this.searchingById) {
        this.resetAfterFilterClear();
      }
    },

    contextPartnersType() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
    defaultAppliedFilters() {
      // refresh indicators
      this.indicators = [...this.indicators];
    },
    actToCreate(newValue, oldValue) {
      if (!newValue && oldValue) {
        this.resetState();
      }
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
