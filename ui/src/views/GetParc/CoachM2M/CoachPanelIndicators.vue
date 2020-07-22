<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Tests standards</h5>
        <ul class="list-group list-group-flush">
          <CoachPanelndicatorItem v-for="i in standardsIndicators" :key="i.id" :indicator="i" />
        </ul>
      </div>
    </div>
    <div class="card mt-2">
      <div class="card-body">
        <h5 class="card-title">Tests Avancés</h5>
        <ul class="list-group list-group-flush">
          <CoachPanelndicatorItem v-for="i in advancedIndicators" :key="i.id" :indicator="i" />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import CoachPanelndicatorItem from './CoachPanelndicatorItem';

export default {
  name: 'CoachpanelIndicators',
  components: {
    CoachPanelndicatorItem,
  },
  props: {
    lineId: String,
  },
  mounted() {
    console.log('Load info for : ', this.lineId);
  },
  data() {
    return {
      advancedIndicators: [
        {
          id: 'i_2',
          title: 'Analyse de la localité',
          subTitle: '250 Cartes SIM détéctées',
          checked: true,
        },
        {
          id: 'i_4',
          title: 'Analyse de la cellule',
          subTitle: '11 Cartes SIM détéctées',
          checked: true,
        },
        {
          id: 'i_6',
          title: 'Test accroche réseau',
          subTitle: 'Détéctée le 18/11/2018 à 16h:23mn:31s',
          checked: true,
        },
        {
          id: 'i_8',
          title: 'Analyse du dernier usage',
          subTitle: 'Data le 18/11/2018 à 16h:23mn:31s',
          checked: true,
        },
      ],
      standardsIndicators: [
        {
          id: 'i_1',
          title: 'Statut de la ligne',
          subTitle: 'Actif',
          checked: true,
        },
        {
          id: 'i_3',
          title: 'Test data',
          subTitle: 'Autorisée à trafiquer',
          checked: true,
        },
        {
          id: 'i_5',
          title: 'Test du réseau',
          subTitle: 'Carte non connectée',
          checked: false,
        },
        {
          id: 'i_7',
          title: 'Attribution adresse IP',
          subTitle: 'IP correctement attribuée',
          checked: true,
        },
      ],
    };
  },
};
</script>

<style scoped>
h5 {
  font-size: 1rem;
  font-weight: 400;
}
.card-title {
  text-transform: uppercase;
}
</style>
