<template>
  <div>
    <h3>LISTES DES CARTES SIM ASSOCIÉES À CETTE ENTITÉ</h3>

    <div class="cards">
      <CardsSkeleton v-if="isLoading" />
      <template v-else>
        <Card v-for="sim in simCards" :key="sim.id" :can-delete="false" :can-modify="false">
          <ul>
            <li>
              <strong>Carte {{ sim.simCard.name }}</strong>
            </li>
            <li>Format : {{ sim.simCard.format }}</li>
            <li>Brevets et fonctionnalités : {{ sim.simCard.licence }}</li>
            <li class="cards-orderdate">Dernière commande : {{ sim.orderDate }}</li>
          </ul>

          <div class="cards-sim">
            <img src="@/assets/simtype.png" />
          </div>
        </Card>
        <CardButton v-if="canShowActions" @click="manageOffers"
          >Gérer les cartes SIM associées</CardButton
        >
      </template>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card';
import CardButton from '@/components/CardButton';
import CardsSkeleton from '@/views/GetAdmin/PartnerDetail/CardsSkeleton.vue';

import { mapMutations, mapGetters } from 'vuex';

import { fetchSim } from '@/api/products.js';

export default {
  components: {
    CardButton,
    Card,
    CardsSkeleton,
  },

  props: {
    partner: Object,
  },

  data() {
    return {
      isLoading: true,
      simCards: [],
    };
  },

  async mounted() {
    this.simCards = await fetchSim(this.partner.id);
    this.isLoading = false;
  },

  methods: {
    ...mapMutations(['openPanel', 'confirmAction']),
  },

  computed: {
    ...mapGetters(['userInfos']),
  },
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #0055a4;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  &-sim {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  ul {
    padding: 0;

    li {
      list-style-type: none;
      margin-bottom: 5px;

      strong {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  &-orderdate {
    color: #7d7d7d;
    font-size: 12px;
  }
}
</style>
