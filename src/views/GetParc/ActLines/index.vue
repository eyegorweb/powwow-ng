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
        <ActionCarousel :actions="carouselItems" />
      </div>
    </div>
    <div class="row">
      <div class="col-md-3">
        <GetLinesIndicators />
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
import GetLinesIndicators from './GetLinesIndicators';
import ActionCarousel from '@/components/ActionCarousel';
import { mapState, mapActions } from 'vuex';

export default {
  components: {
    Tooltip,
    FilterBar,
    LinesTable,
    GetLinesIndicators,
    ActionCarousel,
  },
  data() {
    const carouselItems = [
      {
        icon: 'ic-Heart-Rythm-Icon',
        title: 'En cours consommation',
        subtitle: '50 cartes éligibles',
        inactive: true,
      },
      {
        icon: 'ic-Stats-Icon',
        title: 'Export consommation',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Gérer des alarmes',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Clock-Icon',
        title: 'Export dernier usage',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Wallet-Icon',
        title: 'Changement de C.F.',
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Cart-Icon',
        title: "Changement d'offre",
        subtitle: '50 cartes éligibles',
      },
      {
        icon: 'ic-Amplifier-Icon',
        title: 'Positionner une alarme7',
        subtitle: '50 cartes éligibles',
      },
    ];
    return {
      carouselItems,
    };
  },
  computed: {
    ...mapState('userContext', ['contextPartnersTypes', 'contextPartners']),
  },
  methods: {
    ...mapActions('actLines', ['initFilterForContext']),
  },
  mounted() {
    console.log('mount index act lines');
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
