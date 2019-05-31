<template>
  <div class="mt-4">
    <div class="row mb-4">
      <div class="col-md-9">
        <h4>
          <b>GetParc</b>
          - {{ $t('getparc.management-lines') }}
          <Tooltip direction="right">
            {{ $t('getparc.tooltip-title-text') }}
          </Tooltip>
        </h4>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col-md-12">
        <ActionCarousel :actions="carouselItems" @itemClick="onCarouselItemClick" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <LoaderContainer :is-loading="isIndicatorsLoading">
          <Indicators
            :meta="indicators"
            :fetch-fn="getFetchIndicatorsFn()"
            :set-current-filters-fn="setCurrentFiltersForIndicator"
          />
        </LoaderContainer>
        <br />
        <FilterBar />
      </div>
      <div class="col-md-9">
        <LinesTable />
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/ui/Tooltip';
import FilterBar from './FilterBar';
import LinesTable from './LinesTable';
import ActionCarousel from '@/components/ActionCarousel';
import Indicators from '@/components/Indicators';
import LoaderContainer from '@/components/LoaderContainer';

// import ActCreationBox from './ActCreationBox';
// import PartnerSelectionForAction from './PartnerSelectionForAction';

import { fetchIndicators } from '@/api/linesActions';
import { fetchTotalMassActions } from '@/api/massActions';

import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  components: {
    Tooltip,
    FilterBar,
    LinesTable,
    ActionCarousel,
    Indicators,
    LoaderContainer,
    // ActCreationBox,
    // PartnerSelectionForAction,
  },
  data() {
    const carouselItems = [
      {
        icon: 'ic-Heart-Rythm-Icon',
        title: 'En cours consommation',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Stats-Icon',
        title: 'Export consommation',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Gérer des alarmes',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Clock-Icon',
        title: 'Export dernier usage',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Wallet-Icon',
        title: 'Changement de C.F.',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Cart-Icon',
        title: "Changement d'offre",
        subtitle: '50 cartes éligibles',
        selected: false,
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Positionner une alarme',
        subtitle: '50 cartes éligibles',
        selected: false,
      },
    ];
    return {
      carouselItems,
      isIndicatorsLoading: false,
      indicators: [
        {
          name: 'notProcessedResiliations',
          labelKey: 'indicators.getparc.lines.cancellation',
          color: 'text-danger',
          clickable: false,
          filters: [
            {
              id: 'filters.lines.commercialStatus',
              values: [
                {
                  id: 'demandeDeResiliation',
                  label: 'demandeDeResiliation',
                },
              ],
            },
            {
              id: 'filters.lines.terminationValidated',
              value: true,
            },
          ],
        },
        // taper sur l'api massActions
        {
          name: 'failed',
          labelKey: 'indicators.getparc.lines.failed',
          color: 'text-danger',
          clickable: false,
          filters: [
            {
              id: 'filters.actStatus',
              values: [
                {
                  id: 'IN_ERROR',
                  label: 'En erreur',
                },
              ],
            },
          ],
          fetch: async indicator => {
            return await fetchTotalMassActions(indicator.filters);
          },
        },
        {
          name: 'simCardsInStock',
          labelKey: 'indicators.getparc.lines.availableSIMCards',
          color: 'text-success',
          clickable: true,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'NOT_PREACTIVATED',
                  label: 'Non préactivée',
                },
              ],
            },
          ],
        },
        {
          name: 'allocatedSIMCards',
          labelKey: 'indicators.getparc.lines.allocatedSIMCards',
          color: 'text-success',
          clickable: true,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'PREACTIVATED',
                  label: 'Préactivée',
                },
              ],
            },
          ],
        },
        {
          name: 'activatedSIMCards',
          labelKey: 'indicators.getparc.lines.activatedSIMCards',
          color: 'text-success',
          clickable: true,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                  label: 'Activé',
                },
              ],
            },
          ],
        },
        {
          name: 'suspended',
          labelKey: 'indicators.getparc.lines.suspended',
          color: 'text-warning',
          clickable: true,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'SUSPENDED',
                  label: 'Suspendue',
                },
              ],
            },
          ],
        },
        {
          name: 'traffic',
          labelKey: 'indicators.getparc.lines.traffic',
          color: 'text-warning',
          clickable: true,
          filters: [
            {
              id: 'filters.lines.traffic',
              values: [
                {
                  id: 'lineTrafficState',
                  label: 'Oui',
                },
              ],
            },
          ],
        },
        /*
        // Reporté
        {
          name: 'validation',
          labelKey: 'indicators.getparc.lines.validation',
          filters: [],
        },
        //*/
      ],
    };
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext']),
    ...mapMutations('actLines', ['setCurrentFilters', 'applyFilters']),

    getFetchIndicatorsFn() {
      return async indicators => {
        this.isIndicatorsLoading = true;
        const response = await fetchIndicators(indicators);
        this.isIndicatorsLoading = false;
        return response;
      };
    },

    onCarouselItemClick(item) {
      item.selected = !item.selected;

      this.carouselItems = this.carouselItems.map(i => {
        if (item.title !== i.title) {
          i.selected = false;
          return i;
        }
        return i;
      });
    },

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },
  },
  mounted() {
    this.initFilterForContext();
  },
  watch: {
    contextPartnersTypes() {
      this.initFilterForContext();
    },
    contextPartners() {
      this.initFilterForContext();
    },
  },
};
</script>

<style scoped></style>
