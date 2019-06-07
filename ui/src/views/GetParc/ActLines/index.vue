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

    <ActCreationPrerequisites v-if="creationMode" :act="currentActCreationItem" />

    <div class="row">
      <div class="col-md-3">
        <Indicators
          :meta="indicators"
          :fetch-fn="getFetchIndicatorsFn()"
          :set-current-filters-fn="setCurrentFiltersForIndicator"
        />
        <br />
        <FilterBar />
      </div>
      <div class="col-md-9">
        <Title num="1" v-if="creationMode" title="getparc.actLines.step1Title" />
        <LinesTable :creation-mode="creationMode" />

        <Title num="2" v-if="creationMode" :title="currentActCreationItem.stepTitle" />
        <ActCreationActForm v-if="creationMode" />
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
import { fetchIndicators } from '@/api/linesActions';
import { mapState, mapActions, mapMutations } from 'vuex';

import indicatorItems from './indicatorItems';

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
      isIndicatorsLoading: false,
      /**
       *  {
       *    prerequisites: {},
       *  }
       */
      currentActCreationItem: null,
      indicators: indicatorItems,
      carouselItems: [
        {
          icon: 'ic-Heart-Rythm-Icon',
          title: 'getparc.actCreation.carouselItem.CHANGE_SERVICES',
          stepTitle: 'getparc.actCreation.carouselItem.STEP_TITLE_CHANGE_SERVICES',
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
          icon: 'ic-Heart-Rythm-Icon',
          title: 'getparc.actCreation.carouselItem.CONSUMING',
          subtitle: '',
          selected: false,
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
      ],
    };
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
    creationMode() {
      return this.currentActCreationItem;
    },
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext', 'mergeCurrentFiltersWith']),
    ...mapMutations('actLines', ['setCurrentFilters', 'applyFilters', 'setActToCreate']),

    getFetchIndicatorsFn() {
      return fetchIndicators;
    },

    onCarouselItemClick(item) {
      item.selected = !item.selected;

      if (item.selected) {
        this.currentActCreationItem = item;
        if (item.filters) {
          this.setActToCreate(item);
          this.mergeCurrentFiltersWith(item.filters);
        }
      } else {
        this.currentActCreationItem = null;
        this.setActToCreate(null);
      }

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
