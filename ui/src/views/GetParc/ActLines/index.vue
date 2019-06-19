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

    <ActCreationPrerequisites v-if="creationMode" :act="actToCreate" />

    <div class="row">
      <div class="col-md-3">
        <Indicators
          :meta="indicators"
          :set-current-filters-fn="setCurrentFiltersForIndicator"
          :partners="partnersForIndicators"
        />
        <br />
        <FilterBar />
      </div>
      <div class="col-md-9">
        <Title num="1" v-if="creationMode" title="getparc.actLines.step1Title" />
        <LinesTable :creation-mode="creationMode" />

        <Title
          num="2"
          v-if="creationMode && actCreationPrerequisites"
          :title="actToCreate.stepTitle"
        />
        <ActCreationActForm v-if="creationMode && actCreationPrerequisites" :act="actToCreate" />
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
import { fetchSingleIndicator } from '@/api/linesActions';
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex';

import { fetchTotalMassActions } from '@/api/massActions';

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
  },
  data() {
    return {
      prereqSet: false,
      isIndicatorsLoading: false,
      /**
       *  {
       *    prerequisites: {},
       *  }
       */
      indicators: [
        {
          name: 'notProcessedResiliations',
          labelKey: 'indicators.getparc.lines.cancellation',
          color: 'text-danger',
          clickable: false,
          total: '-',
          roles: ['BO'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        // taper sur l'api massActions
        {
          name: 'failed',
          labelKey: 'indicators.getparc.lines.failed',
          color: 'text-danger',
          clickable: false,
          total: '-',
          roles: ['BO', 'PARTNER'],
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
          hideZeroValue: true,
        },
        {
          name: 'simCardsInStock',
          labelKey: 'indicators.getparc.lines.availableSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'allocatedSIMCards',
          labelKey: 'indicators.getparc.lines.allocatedSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'activatedSIMCards',
          labelKey: 'indicators.getparc.lines.activatedSIMCards',
          color: 'text-success',
          clickable: true,
          total: '-',
          roles: ['PARTNER'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'suspended',
          labelKey: 'indicators.getparc.lines.suspended',
          color: 'text-warning',
          clickable: true,
          total: '-',
          roles: ['BO', 'PARTNER'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
        },
        {
          name: 'traffic',
          labelKey: 'indicators.getparc.lines.traffic',
          color: 'text-warning',
          clickable: true,
          total: '-',
          roles: ['BO'],
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
          fetch: async (indicator, partners) => {
            return await fetchSingleIndicator(indicator.filters, partners);
          },
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
      carouselItems: [
        {
          icon: 'ic-Heart-Rythm-Icon',
          title: 'getparc.actCreation.carouselItem.SUSPEND',
          stepTitle: 'getparc.actCreation.step2Titles.SUSPEND',
          subtitle: '',
          selected: false,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                  label: 'Activée',
                },
              ],
            },
          ],
        },
        {
          icon: 'ic-Wallet-Icon',
          title: 'getparc.actCreation.carouselItem.REACTIVATE',
          stepTitle: 'getparc.actCreation.carouselItem.REACTIVATE',
          subtitle: '',
          selected: false,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                  label: 'Activée',
                },
              ],
            },
          ],
        },
        /*
         {
          icon: 'ic-Heart-Rythm-Icon',
          title: 'getparc.actCreation.carouselItem.CHANGE_SERVICES',
          stepTitle: 'getparc.actCreation.carouselItem.step2Titles.CHANGE_SERVICES',
          subtitle: '',
          selected: false,
          filters: [
            {
              id: 'filters.lines.SIMCardStatus',
              values: [
                {
                  id: 'ACTIVATED',
                  label: 'Activée',
                },
              ],
            },
          ],
        },
        {
          icon: 'ic-Stats-Icon',
          title: 'getparc.actCreation.carouselItem.EXPORT_CONS',
          subtitle: '',
          selected: false,
        },
        {
          icon: 'ic-Amplifier-Icon',
          title: 'getparc.actCreation.carouselItem.MANAGE_ALARMS',
          subtitle: '',
          selected: false,
        },
        {
          icon: 'ic-Clock-Icon',
          title: 'getparc.actCreation.carouselItem.EXPORT_LAST_USAGE',
          subtitle: '',
          selected: false,
        },
        {
          icon: 'ic-Wallet-Icon',
          title: 'getparc.actCreation.carouselItem.CHANGE_CF',
          subtitle: '',
          selected: false,
        },
        {
          icon: 'ic-Cart-Icon',
          title: 'getparc.actCreation.carouselItem.CHANGE_OFFER',
          subtitle: '',
          selected: false,
        },
        {
          icon: 'ic-Amplifier-Icon',
          title: 'getparc.actCreation.carouselItem.POSITION_ALARM',
          subtitle: '',
          selected: false,
        },
        //*/
      ],
    };
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    ...mapState('actLines', ['defaultAppliedFilters', 'actCreationPrerequisites']),
    ...mapGetters('actLines', ['appliedFilters']),
    ...mapState({
      actToCreate: state => state.actLines.actToCreate,
    }),
    creationMode() {
      return this.actToCreate;
    },
    partnersForIndicators() {
      if (this.defaultAppliedFilters && this.defaultAppliedFilters.length) {
        return this.defaultAppliedFilters.find(f => f.id === 'filters.partners');

        /*
        if (filterPartner && filterPartner.values && filterPartner.values.length === 1) {
          return filterPartner;
        }
        //*/
      }

      return null;
    },
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext', 'mergeCurrentFiltersWith']),
    ...mapMutations('actLines', ['setCurrentFilters', 'applyFilters', 'setActToCreate']),

    onCarouselItemClick(item) {
      item.selected = !item.selected;

      if (item.selected) {
        if (item.filters) {
          this.setActToCreate(item);
          this.mergeCurrentFiltersWith(item.filters);
        }
      } else {
        this.setActToCreate(null);
      }

      /*
      this.carouselItems = this.carouselItems.map(i => {
        if (item.title !== i.title) {
          i.selected = false;
          return i;
        }
        return i;
      });
      //*/
    },

    setCurrentFiltersForIndicator(indicator) {
      this.setCurrentFilters([...indicator.filters]);
      this.applyFilters();
    },

    onPrereqSet() {
      this.prereqSet = true;
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
    defaultAppliedFilters() {
      // refresh indicators
      this.indicators = [...this.indicators];
    },
  },
};
</script>

<style scoped></style>
